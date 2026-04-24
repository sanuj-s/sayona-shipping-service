"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Loader2, CreditCard, Users, Package, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UsageData {
  shipment_count: number;
  user_count: number;
  plan_id: string;
  status: string;
  shipment_limit: number;
  user_limit: number;
  plan_name: string;
  price: number;
}

export default function BillingPage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await apiClient.get<UsageData>("/v1/tenants/usage");
      setUsage(response.data);
    } catch (error: any) {
      toast.error("Failed to load usage data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      const response = await apiClient.post("/v1/tenants/upgrade-plan", { planId });
      if (response.success) {
        toast.success(response.data.message || `Upgraded to ${planId}`);
        await fetchUsage();
      }
    } catch (error: any) {
      toast.error(error.message || "Upgrade failed");
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-navy" />
      </div>
    );
  }

  if (!usage) {
    return (
      <div className="p-8 text-center text-slate-500">
        Failed to load billing details.
      </div>
    );
  }

  const shipmentPercent = usage.shipment_limit === -1 ? 0 : Math.min(100, (usage.shipment_count / usage.shipment_limit) * 100);
  const userPercent = usage.user_limit === -1 ? 0 : Math.min(100, (usage.user_count / usage.user_limit) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-navy">Billing & Subscription</h1>
        <p className="text-slate-500">Manage your workspace plan and monitor usage.</p>
      </div>

      {/* Usage Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-navy/5 text-navy rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Shipment Usage</h3>
              <p className="text-sm text-slate-500">
                {usage.shipment_count} / {usage.shipment_limit === -1 ? "Unlimited" : usage.shipment_limit} shipments
              </p>
            </div>
          </div>
          {usage.shipment_limit !== -1 && (
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${shipmentPercent > 90 ? 'bg-red-500' : 'bg-gold'}`} 
                style={{ width: `${shipmentPercent}%` }}
              ></div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-navy/5 text-navy rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">User Seats</h3>
              <p className="text-sm text-slate-500">
                {usage.user_count} / {usage.user_limit === -1 ? "Unlimited" : usage.user_limit} users
              </p>
            </div>
          </div>
          {usage.user_limit !== -1 && (
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${userPercent > 90 ? 'bg-red-500' : 'bg-gold'}`} 
                style={{ width: `${userPercent}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-bold text-navy mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className={`relative rounded-2xl border p-6 shadow-sm flex flex-col ${usage.plan_id === 'free' ? 'border-gold ring-1 ring-gold bg-gold/5' : 'border-slate-200 bg-white'}`}>
            {usage.plan_id === 'free' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT</span>
            )}
            <h3 className="text-lg font-bold text-navy">Free Tier</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
              $0
              <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
            </div>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> 50 Shipments</li>
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> 5 User Seats</li>
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> Basic Support</li>
            </ul>
            <Button disabled className="mt-8 w-full" variant={usage.plan_id === 'free' ? "default" : "outline"}>
              {usage.plan_id === 'free' ? 'Active Plan' : 'Downgrade (Contact Support)'}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className={`relative rounded-2xl border p-6 shadow-sm flex flex-col ${usage.plan_id === 'pro' ? 'border-gold ring-1 ring-gold bg-gold/5' : 'border-slate-200 bg-white'}`}>
            {usage.plan_id === 'pro' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT</span>
            )}
            <h3 className="text-lg font-bold text-navy">Pro Tier</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-slate-900">
              $99
              <span className="ml-1 text-xl font-medium text-slate-500">/mo</span>
            </div>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> 500 Shipments</li>
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> 20 User Seats</li>
              <li className="flex gap-x-3 text-sm text-slate-600"><Check className="h-5 w-5 text-gold flex-none" /> Priority Support</li>
            </ul>
            <Button 
              className={`mt-8 w-full ${usage.plan_id === 'pro' ? 'bg-slate-200 text-slate-700 hover:bg-slate-200' : 'bg-navy hover:bg-navy/90 text-white'}`}
              disabled={isUpgrading || usage.plan_id === 'pro'}
              onClick={() => handleUpgrade('pro')}
            >
              {usage.plan_id === 'pro' ? 'Active Plan' : 'Upgrade to Pro'}
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className={`relative rounded-2xl border p-6 shadow-sm flex flex-col ${usage.plan_id === 'enterprise' ? 'border-gold ring-1 ring-gold bg-gold/5' : 'border-slate-900 bg-slate-900 text-white'}`}>
            {usage.plan_id === 'enterprise' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full">CURRENT</span>
            )}
            <h3 className="text-lg font-bold text-white">Enterprise Tier</h3>
            <div className="mt-4 flex items-baseline text-4xl font-extrabold text-white">
              $499
              <span className="ml-1 text-xl font-medium text-slate-400">/mo</span>
            </div>
            <ul className="mt-6 space-y-4 flex-1">
              <li className="flex gap-x-3 text-sm text-slate-300"><Check className="h-5 w-5 text-gold flex-none" /> Unlimited Shipments</li>
              <li className="flex gap-x-3 text-sm text-slate-300"><Check className="h-5 w-5 text-gold flex-none" /> Unlimited User Seats</li>
              <li className="flex gap-x-3 text-sm text-slate-300"><Check className="h-5 w-5 text-gold flex-none" /> 24/7 Dedicated Support</li>
            </ul>
            <Button 
              className={`mt-8 w-full ${usage.plan_id === 'enterprise' ? 'bg-slate-800 text-white hover:bg-slate-800' : 'bg-gold hover:bg-gold/90 text-white'}`}
              disabled={isUpgrading || usage.plan_id === 'enterprise'}
              onClick={() => handleUpgrade('enterprise')}
            >
              {isUpgrading && usage.plan_id !== 'enterprise' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              {usage.plan_id === 'enterprise' ? 'Active Plan' : 'Upgrade to Enterprise'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
