import { useState } from 'react';
import { RefreshCw, Sparkles, Check, Wand2, Lightbulb } from 'lucide-react';
import { 
  PRESET_MESSAGE_TONES, 
  getSingleSuggestedMessage, 
  type MessageTone, 
  type PresetMessageItem,
} from '../lib/presetMessages';

interface SmartMessageSuggestionProps {
  pageType: string;
  onApplyMessage: (text: string) => void;
}

export function SmartMessageSuggestion({ pageType, onApplyMessage }: SmartMessageSuggestionProps) {
  const [selectedTone, setSelectedTone] = useState<MessageTone>('traditional');
  const [refreshSeed, setRefreshSeed] = useState<number>(0);

  // Get single candidate message derived from page type + selected tone + seed
  const currentSuggestion = getSingleSuggestedMessage(pageType, selectedTone, refreshSeed);

  const handleRefresh = () => {
    setRefreshSeed(prev => prev + 1);
  };

  return (
    <div className="bg-gradient-to-br from-brand-teal via-brand-deep-blue to-stone-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-brand-teal/30 space-y-4">
      {/* ... header ... */}
      <div className="flex items-center justify-between gap-2 border-b border-brand-teal/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-teal/40 rounded-xl text-brand-yellow">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Smart Suggestions
              </span>
            </div>
            <h3 className="text-xs sm:text-sm font-serif font-bold text-white flex items-center gap-1.5">
              Page-Specific Wording Generator
            </h3>
          </div>
        </div>
      </div>

      {/* Tone Options */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-brand-yellow" />
          <span>Select Wording Tone Option</span>
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
          {PRESET_MESSAGE_TONES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTone(t.id);
                setRefreshSeed(0);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 border ${
                selectedTone === t.id
                  ? 'bg-accent text-stone-950 border-brand-orange/30 shadow-md scale-105'
                  : 'bg-brand-teal/40 hover:bg-brand-teal/60 text-stone-100 border-brand-teal/20'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Text Area with Reset Key */}
      <SuggestionEditor 
        key={`${currentSuggestion.id}-${refreshSeed}`}
        suggestion={currentSuggestion}
        onApplyMessage={onApplyMessage}
        onRefresh={handleRefresh}
      />
    </div>
  );
}

interface SuggestionEditorProps {
  suggestion: PresetMessageItem;
  onApplyMessage: (text: string) => void;
  onRefresh: () => void;
}

function SuggestionEditor({ suggestion, onApplyMessage, onRefresh }: SuggestionEditorProps) {
  const [editableText, setEditableText] = useState(suggestion.text);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    if (editableText.trim()) {
      onApplyMessage(editableText.trim());
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  return (
    <div className="bg-brand-teal/30 p-3.5 rounded-xl border border-brand-teal/20 space-y-2.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-brand-yellow flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-accent" />
          {suggestion.title}
        </span>
        <span className="text-[10px] text-stone-300 capitalize px-2 py-0.5 bg-brand-teal/40 rounded-md border border-brand-teal/20">
          {suggestion.tone}
        </span>
      </div>

      <textarea
        rows={3}
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        placeholder="Suggested wording will appear here..."
        className="w-full p-3 bg-stone-900/90 border border-brand-teal/30 rounded-xl text-xs text-stone-100 font-serif leading-relaxed focus:ring-2 focus:ring-accent outline-none resize-none"
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <button
          type="button"
          onClick={onRefresh}
          className="w-full sm:w-auto justify-center px-4 py-2 sm:py-1.5 bg-brand-teal/40 hover:bg-brand-teal/60 text-stone-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-brand-teal/20"
        >
          <RefreshCw className="w-3.5 h-3.5 text-accent" />
          Next Option 🔄
        </button>

        <button
          type="button"
          onClick={handleApply}
          className={`w-full sm:w-auto justify-center px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
            applied
              ? 'bg-secondary text-white'
              : 'bg-primary hover:bg-primary/90 text-white shadow-brand-red/20'
          }`}
        >
          {applied ? <Check className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
          {applied ? 'Applied to Invitation!' : 'Use This Message ✨'}
        </button>
      </div>
    </div>
  );
}
