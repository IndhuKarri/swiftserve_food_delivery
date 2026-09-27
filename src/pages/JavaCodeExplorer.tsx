import React, { useState } from 'react';
import {
  Code2,
  Folder,
  FileCode,
  CheckCircle,
  Copy,
  Layers,
  Sparkles,
  Info,
  Server
} from 'lucide-react';
import { JAVA_PROJECT_FILES, JavaSourceFile } from '../services/javaBackendService';

export const JavaCodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaSourceFile>(JAVA_PROJECT_FILES[2]); // Default to BFSService
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['all', 'model', 'service', 'algorithm', 'controller', 'config'];
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredFiles = categoryFilter === 'all'
    ? JAVA_PROJECT_FILES
    : JAVA_PROJECT_FILES.filter(f => f.category === categoryFilter);

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-orange-500/20 text-orange-300 font-mono px-2.5 py-0.5 rounded-full border border-orange-500/30">
              OOPJ BACKEND ARCHITECTURE
            </span>
            <span className="text-xs text-slate-400">• Java Spring Boot &amp; JDBC Stack</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Java Enterprise Codebase &amp; OOP Principles</h1>
          <p className="text-xs text-slate-400">
            Encapsulation, Abstraction, Inheritance, Polymorphism, and Service Layer orchestration.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-slate-900 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 font-mono">
            Java 21 LTS • Maven Package
          </span>
        </div>
      </div>

      {/* Package Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition ${
              categoryFilter === cat
                ? 'bg-orange-500 text-slate-950 font-bold shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {cat === 'all' ? 'All Packages' : `com.swiftserve.${cat}`}
          </button>
        ))}
      </div>

      {/* Main Grid: File Tree (4 cols) & Code Viewer (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Explorer */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 text-xs text-slate-400 font-semibold">
              <span className="flex items-center space-x-1.5">
                <Folder className="w-4 h-4 text-amber-400" />
                <span>src/main/java/</span>
              </span>
              <span>{filteredFiles.length} classes</span>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {filteredFiles.map(file => (
                <button
                  key={file.fileName}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex flex-col space-y-1 ${
                    selectedFile.fileName === file.fileName
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 font-bold'
                      : 'text-slate-300 hover:bg-slate-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCode className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{file.fileName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate pl-5">
                    {file.packagePath}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* OOP Concept Inspector Box */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 space-y-2 shadow-xl text-xs">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>OOP Principle in Selected File:</span>
            </div>
            <div className="font-bold text-white text-xs">
              {selectedFile.oopConcept}
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {selectedFile.description}
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          {/* Header Bar */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-500">{selectedFile.packagePath}.</span>
              <span className="text-orange-400 font-bold">{selectedFile.fileName}</span>
            </div>

            <button
              onClick={handleCopy}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
