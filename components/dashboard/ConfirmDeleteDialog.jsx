"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShieldAlert, Loader2 } from "lucide-react";

/**
 * A unified confirmation dialog for deletion or high-impact actions.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The button or element that opens the dialog.
 * @param {string} props.title - Dialog title.
 * @param {string} props.description - Dialog description text.
 * @param {Function} props.onConfirm - Action to take on confirmation.
 * @param {string} props.cancelText - Label for cancel button.
 * @param {string} props.confirmText - Label for confirm button.
 * @param {boolean} props.loading - Shows a loader on the confirm button.
 * @param {string} props.variant - "destructive" (red) or "warning" (amber).
 */
export default function ConfirmDeleteDialog({
  trigger,
  title,
  description,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  loading = false,
  variant = "destructive",
}) {
  const isDestructive = variant === "destructive";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 rounded-[32px] overflow-hidden max-w-[400px]">
        <AlertDialogHeader className="space-y-4">
          <div className={`mx-auto w-14 h-14 rounded-3xl flex items-center justify-center transition-colors ${
            isDestructive 
              ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600" 
              : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
          }`}>
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-black text-gray-900 dark:text-white leading-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-row gap-3 mt-6 sm:justify-center">
          <AlertDialogCancel className="flex-1 h-12 rounded-2xl border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border-none">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className={`flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all border-none ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                : "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20"
            }`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
