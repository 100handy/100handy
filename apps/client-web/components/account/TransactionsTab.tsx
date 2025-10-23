"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getTransactionHistory,
  getAvailableYears,
  downloadTransactionsCSV,
  downloadTransactionsPDF,
} from "@/lib/supabase/transactions";
import type { Transaction } from "@/lib/supabase/types";

export function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  useEffect(() => {
    getTransactionHistory().then(setTransactions);
    getAvailableYears().then(setAvailableYears);
  }, []);

  const handleDownloadCSV = () => {
    const year = selectedYear ? parseInt(selectedYear) : undefined;
    downloadTransactionsCSV(transactions, year);
    setDownloadDialogOpen(false);
  };

  const handleDownloadPDF = () => {
    const year = selectedYear ? parseInt(selectedYear) : undefined;
    downloadTransactionsPDF(transactions, year);
    setDownloadDialogOpen(false);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-brand-dark font-bold text-2xl sm:text-[34px] mb-6 pb-6 border-b border-gray-300">
          Transaction History
        </h2>

        <div className="max-w-3xl space-y-6">
          <button
            onClick={() => setDownloadDialogOpen(true)}
            disabled={transactions.length === 0}
            className="flex items-center gap-2 text-brand-terracotta hover:text-brand-coral text-sm font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
            >
              <path
                d="M14 9V13C14 13.5304 13.7893 14.0391 13.4142 14.4142C13.0391 14.7893 12.5304 15 12 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 6.5L8 10L11.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10V1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Transaction History
          </button>

          {transactions.length > 0 ? (
            <div className="mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-2 text-brand-dark font-semibold text-sm">Date</th>
                    <th className="text-left py-2 px-2 text-brand-dark font-semibold text-sm">Task</th>
                    <th className="text-left py-2 px-2 text-brand-dark font-semibold text-sm">Amount</th>
                    <th className="text-left py-2 px-2 text-brand-dark font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200">
                      <td className="py-3 px-2 text-brand-dark text-sm">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2 text-brand-dark text-sm">{transaction.task_title || "N/A"}</td>
                      <td className="py-3 px-2 text-brand-dark text-sm">
                        £{(transaction.amount_cents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-brand-dark text-sm capitalize">{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-brand-dark text-sm">You don't have any transactions yet. Get started!</p>
          )}
        </div>
      </div>

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-brand-dark text-xl font-semibold">Download History</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <label className="text-brand-dark text-sm font-medium">Please choose a year.</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a year..." />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.length > 0 ? (
                    availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No transactions available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <p className="text-brand-dark text-sm text-center">Then select a format to start your download.</p>
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={!selectedYear}
                  className="bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 text-white px-8 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  PDF
                </Button>
                <Button
                  onClick={handleDownloadCSV}
                  disabled={!selectedYear}
                  className="bg-[#2D6A4F] hover:bg-[#2D6A4F]/90 text-white px-8 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  CSV
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

