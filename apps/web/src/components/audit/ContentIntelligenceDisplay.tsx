/**
 * Content Intelligence Display Component
 * AI-powered content analysis visualization
 */

'use client';

import { 
  Brain, Sparkles, MessageSquare, Target, Shield, Zap,
  TrendingUp, Users, FileQuestion, AlertTriangle, CheckCircle2,
  BarChart2, PieChart, BookOpen, Search
} from 'lucide-react';
import type { ContentIntelligence } from '@/lib/types/seo-audit';

interface ContentIntelligenceDisplayProps {
  content: ContentIntelligence;
}

export function ContentIntelligenceDisplay({ content }: ContentIntelligenceDisplayProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-400';
      case 'neutral': return 'text-zinc-400';
      case 'negative': return 'text-red-400';
      default: return 'text-zinc-400';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* AI Overview Banner */}
      <div className="p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">AI Content Intelligence</h3>
            <p className="text-sm text-zinc-400">Advanced analysis powered by machine learning</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <span className={`text-xl sm:text-2xl font-bold ${getSentimentColor(content.sentiment.overall)}`}>
              {content.sentiment.overall.charAt(0).toUpperCase() + content.sentiment.overall.slice(1)}
            </span>
            <p className="text-xs text-zinc-500 mt-1">Sentiment</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <span className="text-xl sm:text-2xl font-bold text-cyan-400">{content.eeat.overallScore}</span>
            <p className="text-xs text-zinc-500 mt-1">E-E-A-T Score</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <span className="text-xl sm:text-2xl font-bold text-emerald-400">{content.plagiarism.uniquenessScore}%</span>
            <p className="text-xs text-zinc-500 mt-1">Uniqueness</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <span className="text-xl sm:text-2xl font-bold text-amber-400">{content.aiReadiness.score}</span>
            <p className="text-xs text-zinc-500 mt-1">AI Ready Score</p>
          </div>
        </div>
      </div>
      
      {/* Sentiment Analysis */}
      <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-pink-500/10 rounded-lg">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Sentiment Analysis</h3>
            <p className="text-xs sm:text-sm text-zinc-500">Emotional tone of your content</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-emerald-400">Positive</span>
                <span className="text-zinc-400">{content.sentiment.breakdown.positive}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: `${content.sentiment.breakdown.positive}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Neutral</span>
                <span className="text-zinc-400">{content.sentiment.breakdown.neutral}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-full"
                  style={{ width: `${content.sentiment.breakdown.neutral}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-red-400">Negative</span>
                <span className="text-zinc-400">{content.sentiment.breakdown.negative}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                  style={{ width: `${content.sentiment.breakdown.negative}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* E-E-A-T Scores */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">E-E-A-T Analysis</h3>
            <p className="text-sm text-zinc-500">Google's quality guidelines compliance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'experience', label: 'Experience', icon: Users, data: content.eeat.experience },
            { key: 'expertise', label: 'Expertise', icon: BookOpen, data: content.eeat.expertise },
            { key: 'authoritativeness', label: 'Authority', icon: Target, data: content.eeat.authoritativeness },
            { key: 'trustworthiness', label: 'Trust', icon: Shield, data: content.eeat.trustworthiness },
          ].map((item) => {
            const Icon = item.icon;
            const scoreColor = item.data.score >= 80 ? 'text-emerald-400' : 
                             item.data.score >= 60 ? 'text-cyan-400' : 
                             item.data.score >= 40 ? 'text-amber-400' : 'text-red-400';
            
            return (
              <div key={item.key} className="p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-400">{item.label}</span>
                </div>
                
                <div className="mb-3">
                  <span className={`text-3xl font-bold ${scoreColor}`}>{item.data.score}</span>
                  <span className="text-zinc-600">/100</span>
                </div>
                
                <ul className="space-y-1">
                  {item.data.signals.slice(0, 2).map((signal, i) => (
                    <li key={i} className="text-xs text-zinc-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Topic Analysis */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 rounded-lg">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Topic & Entity Analysis</h3>
            <p className="text-sm text-zinc-500">Content categorization and entity recognition</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Topic */}
          <div>
            <h4 className="text-sm text-zinc-500 mb-3">Primary Topic</h4>
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <span className="text-cyan-400 font-semibold">{content.topics.primary}</span>
            </div>
            
            <h4 className="text-sm text-zinc-500 mt-4 mb-3">Secondary Topics</h4>
            <div className="flex flex-wrap gap-2">
              {content.topics.secondary.map((topic) => (
                <span key={topic} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs rounded-lg">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          {/* Entities */}
          <div>
            <h4 className="text-sm text-zinc-500 mb-3">Detected Entities</h4>
            <div className="space-y-2">
              {content.topics.entities.map((entity) => (
                <div key={entity.name} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <span className="text-white font-medium">{entity.name}</span>
                    <span className="text-xs text-zinc-500 ml-2">({entity.type})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${entity.relevance * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">{(entity.relevance * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Readiness */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">AI & Voice Search Readiness</h3>
            <p className="text-sm text-zinc-500">Future-proof your content</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className={`text-2xl font-bold ${content.aiReadiness.voiceSearchOptimized ? 'text-emerald-400' : 'text-red-400'}`}>
              {content.aiReadiness.voiceSearchOptimized ? '✓' : '✗'}
            </span>
            <p className="text-xs text-zinc-500 mt-2">Voice Search Ready</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className="text-2xl font-bold text-amber-400">{content.aiReadiness.featuredSnippetPotential}%</span>
            <p className="text-xs text-zinc-500 mt-2">Snippet Potential</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className={`text-2xl font-bold ${content.aiReadiness.conversationalReady ? 'text-emerald-400' : 'text-red-400'}`}>
              {content.aiReadiness.conversationalReady ? '✓' : '✗'}
            </span>
            <p className="text-xs text-zinc-500 mt-2">Conversational</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className={`text-2xl font-bold ${content.aiReadiness.structuredContent ? 'text-emerald-400' : 'text-red-400'}`}>
              {content.aiReadiness.structuredContent ? '✓' : '✗'}
            </span>
            <p className="text-xs text-zinc-500 mt-2">Well Structured</p>
          </div>
        </div>
        
        {/* Questions */}
        {content.aiReadiness.questionAnswering.questions.length > 0 && (
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <h4 className="text-sm text-zinc-500 mb-3 flex items-center gap-2">
              <FileQuestion className="w-4 h-4" />
              Questions Your Content Could Answer
            </h4>
            <ul className="space-y-2">
              {content.aiReadiness.questionAnswering.questions.map((q, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {content.aiReadiness.questionAnswering.answered ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span className="text-zinc-300">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Content Gaps */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-red-500/10 rounded-lg">
            <Search className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Content Gaps & Opportunities</h3>
            <p className="text-sm text-zinc-500">Areas for improvement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm text-zinc-500 mb-3">Missing Topics</h4>
            <ul className="space-y-2">
              {content.contentGaps.missingTopics.map((topic, i) => (
                <li key={i} className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm text-zinc-500 mb-3">Related Questions to Answer</h4>
            <ul className="space-y-2">
              {content.contentGaps.relatedQuestions.map((q, i) => (
                <li key={i} className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-sm text-cyan-400">
                  <FileQuestion className="w-4 h-4 flex-shrink-0" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
