#!/usr/bin/env python3
"""
Autophage Protocol Economic Model
Implements revenue streams, unit economics, and break-even analysis

This script validates the economic assumptions from Section 8 of the litepaper,
demonstrating sustainable revenue generation with high contribution margins.
"""

import numpy as np
import matplotlib.pyplot as plt
import json
from typing import Dict, List, Tuple
from dataclasses import dataclass
from datetime import datetime


@dataclass
class RevenueStream:
    """Represents a single revenue stream with its characteristics"""
    name: str
    per_user_month: float
    margin: float
    description: str
    
    @property
    def contribution_per_user(self) -> float:
        """Calculate contribution margin per user"""
        return self.per_user_month * self.margin


class AutophageEconomics:
    """
    Economic model for the Autophage Protocol
    Based on Section 8: Revenue Model and Unit Economics
    """
    
    def __init__(self):
        # Revenue streams with exact values from the paper
        self.revenue_streams = {
            'app_integration': RevenueStream(
                name='App Integration',
                per_user_month=0.15,
                margin=0.95,
                description='App Integration Fees'
            ),
            'marketplace': RevenueStream(
                name='Marketplace',
                per_user_month=0.45,  # 12% of $3.75 avg transaction
                margin=0.88,
                description='Marketplace Fees (12%)'
            ),
            'enterprise': RevenueStream(
                name='Enterprise',
                per_user_month=1.25,  # 5% adoption at $25/user
                margin=0.92,
                description='Enterprise Verification'
            )
        }
        
        # Cost structure
        self.fixed_costs_monthly = 30000  # $30,000 per month
        self.variable_cost_per_user = 0.15  # $0.15 per user per month
        
        # Growth assumptions
        self.initial_users = 1000
        self.monthly_growth_rate = 0.20  # 20% monthly growth
        
    def calculate_revenue(self, users: int) -> Dict[str, float]:
        """Calculate total revenue and breakdown for given user count"""
        revenues = {}
        total_revenue = 0
        
        for stream_id, stream in self.revenue_streams.items():
            stream_revenue = users * stream.per_user_month
            revenues[stream_id] = stream_revenue
            total_revenue += stream_revenue
            
        revenues['total'] = total_revenue
        revenues['per_user'] = total_revenue / users if users > 0 else 0
        
        return revenues
    
    def calculate_costs(self, users: int) -> Dict[str, float]:
        """Calculate total costs for given user count"""
        variable_costs = users * self.variable_cost_per_user
        total_costs = self.fixed_costs_monthly + variable_costs
        
        return {
            'fixed': self.fixed_costs_monthly,
            'variable': variable_costs,
            'total': total_costs,
            'per_user': total_costs / users if users > 0 else 0
        }
    
    def calculate_profit(self, users: int) -> Dict[str, float]:
        """Calculate profit metrics for given user count"""
        revenues = self.calculate_revenue(users)
        costs = self.calculate_costs(users)
        
        gross_profit = revenues['total'] - costs['total']
        
        # Calculate weighted average margin
        total_contribution = sum(
            users * stream.contribution_per_user 
            for stream in self.revenue_streams.values()
        )
        weighted_margin = total_contribution / revenues['total'] if revenues['total'] > 0 else 0
        
        return {
            'gross_profit': gross_profit,
            'margin_percentage': (gross_profit / revenues['total'] * 100) if revenues['total'] > 0 else 0,
            'contribution_margin': weighted_margin,
            'profitable': gross_profit > 0
        }
    
    def break_even_analysis(self) -> Dict[str, float]:
        """Calculate break-even point and related metrics"""
        # Total revenue per user
        revenue_per_user = sum(
            stream.per_user_month 
            for stream in self.revenue_streams.values()
        )
        
        # Contribution margin per user
        contribution_margin = revenue_per_user - self.variable_cost_per_user
        
        # Break-even users
        break_even_users = int(np.ceil(self.fixed_costs_monthly / contribution_margin))
        
        # Time to break-even (assuming exponential growth)
        months_to_break_even = np.log(break_even_users / self.initial_users) / np.log(1 + self.monthly_growth_rate)
        
        return {
            'revenue_per_user': revenue_per_user,
            'variable_cost_per_user': self.variable_cost_per_user,
            'contribution_margin': contribution_margin,
            'break_even_users': break_even_users,
            'months_to_break_even': months_to_break_even,
            'break_even_revenue': break_even_users * revenue_per_user
        }
    
    def growth_projection(self, months: int = 36) -> Tuple[List[int], List[float], List[float]]:
        """Project user growth and revenue over time"""
        users_over_time = []
        revenue_over_time = []
        profit_over_time = []
        
        for month in range(months + 1):
            users = int(self.initial_users * (1 + self.monthly_growth_rate) ** month)
            users_over_time.append(users)
            
            revenue = self.calculate_revenue(users)['total']
            revenue_over_time.append(revenue)
            
            profit = self.calculate_profit(users)['gross_profit']
            profit_over_time.append(profit)
            
        return users_over_time, revenue_over_time, profit_over_time
    
    def sensitivity_analysis(self, base_users: int = 1000000) -> Dict[str, List[float]]:
        """Analyze sensitivity of revenue to parameter changes"""
        sensitivity_range = np.array([-0.20, -0.10, 0, 0.10, 0.20])  # ±20%
        base_revenue = self.calculate_revenue(base_users)['total']
        
        results = {}
        
        # App integration fee sensitivity
        app_revenues = []
        for delta in sensitivity_range:
            temp_model = AutophageEconomics()
            temp_model.revenue_streams['app_integration'].per_user_month *= (1 + delta)
            new_revenue = temp_model.calculate_revenue(base_users)['total']
            app_revenues.append((new_revenue - base_revenue) / base_revenue * 100)
        results['app_integration'] = app_revenues
        
        # Marketplace fee rate sensitivity (affecting per_user_month)
        marketplace_revenues = []
        for delta in sensitivity_range:
            temp_model = AutophageEconomics()
            temp_model.revenue_streams['marketplace'].per_user_month *= (1 + delta)
            new_revenue = temp_model.calculate_revenue(base_users)['total']
            marketplace_revenues.append((new_revenue - base_revenue) / base_revenue * 100)
        results['marketplace'] = marketplace_revenues
        
        # Enterprise adoption sensitivity
        enterprise_revenues = []
        for delta in sensitivity_range:
            temp_model = AutophageEconomics()
            temp_model.revenue_streams['enterprise'].per_user_month *= (1 + delta)
            new_revenue = temp_model.calculate_revenue(base_users)['total']
            enterprise_revenues.append((new_revenue - base_revenue) / base_revenue * 100)
        results['enterprise'] = enterprise_revenues
        
        results['sensitivity_range'] = (sensitivity_range * 100).tolist()
        
        return results
    
    def generate_report(self, output_file: str = 'economic_analysis.json'):
        """Generate comprehensive economic analysis report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'model': 'Autophage Protocol Economic Model v1.0',
            
            # Revenue at 1M users
            'revenue_1m_users': self.calculate_revenue(1000000),
            'costs_1m_users': self.calculate_costs(1000000),
            'profit_1m_users': self.calculate_profit(1000000),
            
            # Break-even analysis
            'break_even': self.break_even_analysis(),
            
            # Growth projections
            'growth_projection_36m': {
                'users': self.growth_projection(36)[0],
                'revenue': self.growth_projection(36)[1],
                'profit': self.growth_projection(36)[2]
            },
            
            # Sensitivity analysis
            'sensitivity': self.sensitivity_analysis()
        }
        
        with open(output_file, 'w') as f:
            json.dump(report, f, indent=2)
            
        return report
    
    def visualize_economics(self):
        """Create comprehensive visualization of economic model"""
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
        fig.suptitle('Autophage Protocol Economic Analysis', fontsize=16)
        
        # 1. Revenue breakdown at 1M users
        revenues = self.calculate_revenue(1000000)
        stream_revenues = [revenues[key] for key in ['app_integration', 'marketplace', 'enterprise']]
        stream_names = [self.revenue_streams[key].description for key in ['app_integration', 'marketplace', 'enterprise']]
        
        ax1.pie(stream_revenues, labels=stream_names, autopct='%1.1f%%', startangle=90)
        ax1.set_title('Revenue Breakdown at 1M Users')
        
        # 2. Break-even analysis
        users_range = np.linspace(0, 50000, 100)
        revenues = [self.calculate_revenue(int(u))['total'] for u in users_range]
        costs = [self.calculate_costs(int(u))['total'] for u in users_range]
        
        ax2.plot(users_range, revenues, label='Revenue', color='green', linewidth=2)
        ax2.plot(users_range, costs, label='Costs', color='red', linewidth=2)
        
        # Mark break-even point
        be_analysis = self.break_even_analysis()
        ax2.axvline(x=be_analysis['break_even_users'], color='purple', linestyle='--', 
                   label=f'Break-even: {be_analysis["break_even_users"]:,} users')
        
        ax2.set_xlabel('Number of Users')
        ax2.set_ylabel('Monthly Amount ($)')
        ax2.set_title('Break-Even Analysis')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # 3. Growth projection
        users, revenues, profits = self.growth_projection(36)
        months = list(range(37))
        
        ax3_twin = ax3.twinx()
        
        line1 = ax3.plot(months, revenues, label='Revenue', color='green', linewidth=2)
        line2 = ax3.plot(months, profits, label='Profit', color='blue', linewidth=2)
        line3 = ax3_twin.plot(months, users, label='Users', color='orange', linewidth=2, linestyle='--')
        
        ax3.set_xlabel('Months')
        ax3.set_ylabel('Monthly Amount ($)')
        ax3_twin.set_ylabel('User Count')
        ax3.set_title('36-Month Growth Projection')
        
        # Combine legends
        lines = line1 + line2 + line3
        labels = [l.get_label() for l in lines]
        ax3.legend(lines, labels, loc='upper left')
        ax3.grid(True, alpha=0.3)
        
        # 4. Sensitivity analysis
        sensitivity = self.sensitivity_analysis()
        x = sensitivity['sensitivity_range']
        
        for stream in ['app_integration', 'marketplace', 'enterprise']:
            ax4.plot(x, sensitivity[stream], 
                    label=self.revenue_streams[stream].description, 
                    linewidth=2, marker='o')
        
        ax4.set_xlabel('Parameter Change (%)')
        ax4.set_ylabel('Revenue Impact (%)')
        ax4.set_title('Sensitivity Analysis')
        ax4.legend()
        ax4.grid(True, alpha=0.3)
        ax4.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        ax4.axvline(x=0, color='black', linestyle='-', alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('economic_analysis.png', dpi=300, bbox_inches='tight')
        plt.show()


def main():
    """Run economic analysis and generate outputs"""
    print("=" * 60)
    print("AUTOPHAGE PROTOCOL ECONOMIC ANALYSIS")
    print("Revenue Model and Unit Economics Validation")
    print("=" * 60)
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Initialize model
    model = AutophageEconomics()
    
    # Break-even analysis
    print("BREAK-EVEN ANALYSIS")
    print("-" * 60)
    be = model.break_even_analysis()
    print(f"Revenue per user: ${be['revenue_per_user']:.2f}/month")
    print(f"Variable cost per user: ${be['variable_cost_per_user']:.2f}/month")
    print(f"Contribution margin: ${be['contribution_margin']:.2f}/month")
    print(f"Break-even users: {be['break_even_users']:,}")
    print(f"Months to break-even: {be['months_to_break_even']:.1f}")
    print(f"Break-even monthly revenue: ${be['break_even_revenue']:,.0f}")
    print()
    
    # Revenue at scale
    print("REVENUE AT 1M USERS")
    print("-" * 60)
    revenue_1m = model.calculate_revenue(1000000)
    costs_1m = model.calculate_costs(1000000)
    profit_1m = model.calculate_profit(1000000)
    
    print(f"Monthly revenue: ${revenue_1m['total']:,.0f}")
    print(f"Annual revenue: ${revenue_1m['total'] * 12:,.0f}")
    print(f"Revenue per user: ${revenue_1m['per_user']:.2f}")
    print(f"Gross margin: {profit_1m['contribution_margin']*100:.1f}%")
    print(f"Monthly profit: ${profit_1m['gross_profit']:,.0f}")
    print()
    
    # Revenue breakdown
    print("REVENUE BREAKDOWN")
    print("-" * 60)
    for stream_id, stream in model.revenue_streams.items():
        stream_revenue = revenue_1m[stream_id]
        percentage = (stream_revenue / revenue_1m['total']) * 100
        print(f"{stream.description}: ${stream_revenue:,.0f} ({percentage:.1f}%)")
    print()
    
    # Growth projection highlights
    print("GROWTH PROJECTION HIGHLIGHTS")
    print("-" * 60)
    users_36m, revenue_36m, profit_36m = model.growth_projection(36)
    
    milestones = [6, 12, 24, 36]
    for month in milestones:
        print(f"Month {month}: {users_36m[month]:,} users, "
              f"${revenue_36m[month]:,.0f} revenue, "
              f"${profit_36m[month]:,.0f} profit")
    print()
    
    # Generate outputs
    print("GENERATING OUTPUTS")
    print("-" * 60)
    
    # Generate report
    report = model.generate_report()
    print("✓ Economic analysis report saved to economic_analysis.json")
    
    # Generate visualization
    model.visualize_economics()
    print("✓ Visualization saved to economic_analysis.png")
    
    print()
    print("=" * 60)
    print("CONCLUSION")
    print("=" * 60)
    print(f"The Autophage Protocol achieves break-even at {be['break_even_users']:,} users")
    print(f"At 1M users, generates ${revenue_1m['total']*12:,.0f} annual revenue")
    print(f"with {profit_1m['contribution_margin']*100:.1f}% gross margins")
    print("=" * 60)


if __name__ == "__main__":
    main()