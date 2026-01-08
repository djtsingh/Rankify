/**
 * Competitor Analysis Display Component
 * Comprehensive competitive intelligence visualization
 */

'use client';

import { 
  Users, Trophy, Target, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight,
  Search, Globe, BarChart2, Award, Zap, Eye
} from 'lucide-react';
import type { CompetitorAnalysis } from '@/lib/types/seo-audit';

interface CompetitorAnalysisDisplayProps {
  competitors: CompetitorAnalysis;
}

function ComparisonBar({ 
  label, 
  yourValue, 
  competitorValue, 
  higher = 'better',
  format = 'number'
}: { 
  label: string;
  yourValue: number;
  competitorValue: number;
  higher?: 'better' | 'worse' | 'neutral';
  format?: 'number' | 'percent' | 'time';
}) {
  const max = Math.max(yourValue, competitorValue);
  const yourWidth = (yourValue / max) * 100;
  const compWidth = (competitorValue / max) * 100;
  
  const youBetter = higher === 'better' ? yourValue >= competitorValue : yourValue <= competitorValue;
  
  const formatValue = (val: number) => {
    switch (format) {
      case 'percent': return `${val}%`;
      case 'time': return `${val}s`;
      default: return val.toLocaleString();
    }
  };
  
  return (
    <div className="p-4 bg-zinc-800/30 rounded-lg">
      <p className="text-sm text-zinc-400 mb-3">{label}</p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-12 text-xs text-zinc-500">You</span>
          <div className="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${youBetter ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${yourWidth}%` }}
            />
          </div>
          <span className={`w-20 text-right text-sm font-medium ${youBetter ? 'text-emerald-400' : 'text-amber-400'}`}>
            {formatValue(yourValue)}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="w-12 text-xs text-zinc-500">Avg.</span>
          <div className="flex-1 h-4 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zinc-600 rounded-full"
              style={{ width: `${compWidth}%` }}
            />
          </div>
          <span className="w-20 text-right text-sm text-zinc-400">
            {formatValue(competitorValue)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CompetitorAnalysisDisplay({ competitors }: CompetitorAnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 border border-orange-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
            <Trophy className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Competitive Intelligence</h3>
            <p className="text-sm text-zinc-400">How you stack up against your competition</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-xl sm:text-2xl font-bold text-cyan-400">{competitors.competitors.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Competitors Analyzed</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-xl sm:text-2xl font-bold text-emerald-400">{competitors.advantages.uniqueKeywords.length + competitors.advantages.contentStrengths.length + competitors.advantages.technicalAdvantages.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Your Advantages</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-400">{competitors.gaps.keywords.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Areas to Improve</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{competitors.gaps.keywords.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Keyword Opportunities</p>
          </div>
        </div>
      </div>
      
      {/* Competitor Breakdown */}
      <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-cyan-500/10 rounded-lg">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Competitor Comparison</h3>
            <p className="text-xs sm:text-sm text-zinc-500">Detailed metrics for each competitor</p>
          </div>
        </div>
        
        {/* Mobile: Card view */}
        <div className="block lg:hidden space-y-4">
          {competitors.competitors.map((comp, i) => (
            <div key={i} className="p-4 bg-zinc-800/30 rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-zinc-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{comp.domain}</p>
                  <p className="text-xs text-zinc-500">Similarity: {Math.round((comp.overallScore / 100) * 100)}%</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-500 text-xs">DA:</span>
                  <span className={`ml-1 font-semibold ${comp.domainAuthority >= 50 ? 'text-emerald-400' : comp.domainAuthority >= 30 ? 'text-amber-400' : 'text-red-400'}`}>
                    {comp.domainAuthority}
                  </span>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-500 text-xs">Traffic:</span>
                  <span className="ml-1 text-zinc-300">{comp.organicTraffic.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-500 text-xs">Keywords:</span>
                  <span className="ml-1 text-zinc-300">{comp.keywords.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-zinc-800/50 rounded">
                  <span className="text-zinc-500 text-xs">Backlinks:</span>
                  <span className="ml-1 text-zinc-300">{comp.backlinks.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop: Table view */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="pb-4 pr-4">Competitor</th>
                <th className="pb-4 pr-4 text-center">DA</th>
                <th className="pb-4 pr-4 text-center">Traffic</th>
                <th className="pb-4 pr-4 text-center">Keywords</th>
                <th className="pb-4 pr-4 text-center">Backlinks</th>
                <th className="pb-4 text-center">Overlap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {competitors.competitors.map((comp, i) => (
                <tr key={i} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{comp.domain}</p>
                        <p className="text-xs text-zinc-500">
                          Similarity: {Math.round((comp.overallScore / 100) * 100)}%
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-center">
                    <span className={`font-semibold ${
                      comp.domainAuthority >= 50 ? 'text-emerald-400' : 
                      comp.domainAuthority >= 30 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {comp.domainAuthority}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-center text-zinc-300">
                    {comp.organicTraffic.toLocaleString()}
                  </td>
                  <td className="py-4 pr-4 text-center text-zinc-300">
                    {comp.keywords.toLocaleString()}
                  </td>
                  <td className="py-4 pr-4 text-center text-zinc-300">
                    {comp.backlinks.toLocaleString()}
                  </td>
                  <td className="py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${Math.min(80, (comp.keywords / 1000) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">
                        {Math.round(comp.keywords * 0.3)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Advantages & Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Your Advantages</h3>
          </div>
          
          <ul className="space-y-2">
            {[...competitors.advantages.uniqueKeywords.slice(0, 2), ...competitors.advantages.contentStrengths.slice(0, 2), ...competitors.advantages.technicalAdvantages.slice(0, 2)].map((adv, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-zinc-300">{adv}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Disadvantages */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-amber-500/10 rounded-lg">
              <XCircle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold">Areas to Improve</h3>
          </div>
          
          <ul className="space-y-2">
            {competitors.gaps.content.slice(0, 5).map((gap, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <TrendingDown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-zinc-300">{gap.topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Keyword Gap Analysis */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 rounded-lg">
            <Search className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Keyword Gap Opportunities</h3>
            <p className="text-sm text-zinc-500">Keywords your competitors rank for that you don&apos;t</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {competitors.gaps.keywords.slice(0, 10).map((gap, i) => {
            const difficultyLevel = gap.difficulty < 30 ? 'easy' : gap.difficulty < 70 ? 'medium' : 'hard';
            const difficultyColor = 
              difficultyLevel === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
              difficultyLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
              'bg-red-500/20 text-red-400';
            
            return (
            <div 
              key={i}
              className="p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{gap.keyword}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${difficultyColor}`}>
                      {difficultyLevel}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>Volume: {gap.volume.toLocaleString()}/mo</span>
                    <span>Competitor rank: #{gap.competitorRank}</span>
                    <span>Difficulty: {gap.difficulty}/100</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-emerald-400">
                    Opportunity
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      
      {/* SERP Features */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">SERP Feature Opportunities</h3>
            <p className="text-sm text-zinc-500">Special search features you could target</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Featured Snippets', value: competitors.serpFeatures.featuredSnippets.eligible, eligible: competitors.serpFeatures.featuredSnippets.eligible },
            { name: 'Local Pack', value: competitors.serpFeatures.localPack, eligible: competitors.serpFeatures.localPack },
            { name: 'Knowledge Panel', value: competitors.serpFeatures.knowledgePanel, eligible: competitors.serpFeatures.knowledgePanel },
            { name: 'Image Results', value: competitors.serpFeatures.imageResults, eligible: competitors.serpFeatures.imageResults },
            { name: 'Video Results', value: competitors.serpFeatures.videoResults, eligible: competitors.serpFeatures.videoResults },
          ].map((feature, i) => {
            const featureIcons: Record<string, React.ComponentType<{ className?: string }>> = {
              'featured snippets': Zap,
              'people also ask': Search,
              'local pack': Globe,
              'knowledge panel': Eye,
              'image results': Eye,
              'video results': Eye,
            };
            
            const Icon = featureIcons[feature.name.toLowerCase()] || Award;
            
            return (
              <div 
                key={i}
                className={`p-4 rounded-lg border ${
                  feature.eligible
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-zinc-800/50 border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${feature.eligible ? 'bg-emerald-500/20' : 'bg-zinc-800'}`}>
                    <Icon className={`w-4 h-4 ${feature.eligible ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{feature.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  {feature.eligible ? (
                    <span className="text-xs text-emerald-400">Eligible</span>
                  ) : (
                    <span className="text-xs text-zinc-500">Not eligible</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Content Gap Analysis */}
      {competitors.gaps.content.length > 0 && (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-cyan-500/10 rounded-lg">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Content Gap Analysis</h3>
              <p className="text-sm text-zinc-500">Topics your competitors cover that you should consider</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {competitors.gaps.content.slice(0, 6).map((gap, i) => (
              <div 
                key={i}
                className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg"
              >
                <p className="text-cyan-400 font-medium mb-2">{gap.topic}</p>
                <p className="text-xs text-zinc-500">
                  Covered by: {gap.competitors.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
