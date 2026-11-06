/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { downloadPhpPackage } from '../services/phpPackageGenerator';
import { X, Download, Server, Database, CheckCircle2, ShieldCheck, FolderArchive, ArrowRight } from 'lucide-react';

interface PhpDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhpDeployModal: React.FC<PhpDeployModalProps> = ({ isOpen, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadPhpPackage();
      setDownloaded(true);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#131B30] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1020]/60">
          <div className="flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-lg text-white">Download Standalone PHP & MySQL Package</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Production Ready Archive</span>
              <h4 className="text-xl font-extrabold text-white">premium-ludo-netlify.zip</h4>
              <p className="text-xs text-slate-300 mt-1">
                Core PHP 8.2+ · MySQL PDO · Automatic Graphical Web Installer · Zero Manual Coding
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 whitespace-nowrap transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Compiling ZIP...' : downloaded ? 'Download Again' : 'Download ZIP Now'}</span>
            </button>
          </div>

          {/* 4 Steps Walkthrough */}
          <div>
            <h5 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
              Deployment in 4 Easy Steps (hPanel / cPanel)
            </h5>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h6 className="font-bold text-white text-xs">Upload to Hosting</h6>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Log into Hostinger hPanel or cPanel, open <strong>File Manager</strong>, and upload <code className="text-amber-300 font-mono">premium-ludo-netlify.zip</code> into <code className="text-amber-300 font-mono">public_html</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h6 className="font-bold text-white text-xs">Extract Archive</h6>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Right-click the zip file in File Manager and click <strong>Extract</strong> directly inside your root directory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h6 className="font-bold text-white text-xs">Create MySQL Database in hPanel</h6>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Under Databases, create a new MySQL database, database user, and password.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="w-7 h-7 rounded-lg bg-amber-600/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h6 className="font-bold text-white text-xs">Run Web Installer at /install/</h6>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Open <code className="text-amber-300 font-mono">https://yourdomain.com/install/</code> in your browser. The graphical wizard verifies requirements, runs tables migrations, and provisions your admin account!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1020]/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Zero manual code edits needed</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
