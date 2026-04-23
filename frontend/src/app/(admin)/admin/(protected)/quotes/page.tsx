"use client";

import { useState, useEffect, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal, ModalHeader, ModalBody } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getQuotes, replyToQuote } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import type { Quote } from "@/lib/types";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const res: any = await getQuotes({ page, limit: 10 });
      setQuotes(Array.isArray(res) ? res : (res?.quotes || []));
      setTotal(res?.total || 0);
    } catch (err) {
       setError(err instanceof Error ? err.message : "Failed to load quotes");
    }
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Fetch initial estimate using our backend calculator when a quote is clicked
  const openReplyModal = async (quote: Quote) => {
    setActiveQuote(quote);
    setReplySuccess(false);
    setReplyError(null);
    setReplyMessage("");
    setEstimatedPrice("");
    
    try {
      const res = await apiClient.get<{ estimatedPrice: string }>(
        `/quotes/estimate?origin=${encodeURIComponent(quote.origin)}&destination=${encodeURIComponent(quote.destination)}&weight=${encodeURIComponent(quote.weight || "0")}&cargoType=${encodeURIComponent(quote.cargoType || "")}`
      );
      setEstimatedPrice(res.estimatedPrice || "");
    } catch {
      // In case auto estimate fails, we just leave it blank
    }
  };

  const submitReply = async () => {
    if (!activeQuote) return;
    setIsReplying(true);
    setReplyError(null);
    
    try {
      await replyToQuote(activeQuote.uuid, {
        message: replyMessage,
        estimatedPrice,
      });
      setReplySuccess(true);
      fetchData(); // Refresh list to show updated status
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Failed to send reply");
    }
    setIsReplying(false);
  };

  const columns = [
    { key: "cargo", header: "Cargo", render: (r: Quote) => <span className="font-semibold">{r.cargo}</span> },
    { key: "origin", header: "Origin" },
    { key: "destination", header: "Destination" },
    { key: "email", header: "Email" },
    {
      key: "status", header: "Status",
      render: (r: Quote) => {
        const v = r.status === "pending" ? "warning" : r.status === "quoted" ? "info" : r.status === "accepted" ? "success" : "error";
        return <Badge variant={v}>{r.status}</Badge>;
      },
    },
    {
      key: "actions", header: "", 
      render: (r: Quote) => (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => openReplyModal(r)}
          disabled={r.status !== "pending" && r.status !== "reviewed"}
        >
          <Mail className="w-4 h-4 mr-2" /> {r.status === 'quoted' ? 'Replied' : 'Reply'}
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Quotes</h1>
      {error && <div className="p-4 text-sm text-error bg-error-light rounded-lg">{error}</div>}
      <DataTable
        columns={columns}
        data={quotes}
        total={total}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        loading={loading}
      />

      <Modal
        open={!!activeQuote}
        onClose={() => setActiveQuote(null)}
      >
        <ModalHeader onClose={() => setActiveQuote(null)}>Reply with Quote Estimate</ModalHeader>
        <ModalBody>
        {activeQuote && (
          <div className="space-y-4">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm space-y-2 mb-4">
              <p><strong>Customer:</strong> {activeQuote.name} ({activeQuote.email})</p>
              <p><strong>Route:</strong> {activeQuote.origin} → {activeQuote.destination}</p>
              <p><strong>Cargo:</strong> {activeQuote.cargo} ({activeQuote.weight || "N/A"})</p>
              {activeQuote.message && (
                <p className="italic text-neutral-500 mt-2">&quot;{activeQuote.message}&quot;</p>
              )}
            </div>

            {replySuccess ? (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-success" />
                <h3 className="text-lg font-bold">Reply Sent!</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  The quote has been dispatched via email and marked as Quoted.
                </p>
                <Button onClick={() => setActiveQuote(null)} variant="primary">Close</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Estimated Price ($)"
                  type="number"
                  placeholder="e.g. 500.00"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                />
                
                <Textarea
                  label="Message to Customer"
                  placeholder="Hello, based on your requirements..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={4}
                />

                {replyError && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-error-light text-error text-sm">
                    <AlertCircle className="w-4 h-4" /> {replyError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                  <Button variant="outline" onClick={() => setActiveQuote(null)}>Cancel</Button>
                  <Button variant="primary" onClick={submitReply} loading={isReplying}>Send Quote</Button>
                </div>
              </div>
            )}
          </div>
        )}
        </ModalBody>
      </Modal>
    </div>
  );
}
