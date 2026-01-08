/**
 * Recommendations Panel Component
 * Comprehensive prioritized action items with filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { 
  AlertTriangle, CheckCircle2, ArrowUpRight, Clock, Target,
  ChevronDown, ChevronUp, Filter, Search, ExternalLink,
  Zap, TrendingUp, DollarSign, Info
} from 'lucide-react';
import type { ActionItem } from '@/lib/types/seo-audit';

interface RecommendationsPanelProps {
  items: ActionItem[];
  title?: string;
  showSearch?: boolean;
  showGrouping?: boolean;
  maxItems?: number;
}

type Priority = 'critical' | 'high' | 'medium' | 'low' | 'opportunity';
type GroupBy = 'priority' | 'category' | 'effort';

const priorityConfig: Record<Priority, { color: string; bg: string; border: string; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical' },
  high: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'High Priority' },
  medium: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', label: 'Medium' },
  low: { color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/30', label: 'Low' },
  opportunity: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Opportunity' },
};

const effortConfig: Record<string, { color: string; label: string; description: string }> = {
  low: { color: 'text-emerald-400', label: 'Quick Win', description: '< 1 hour' },
  medium: { color: 'text-amber-400', label: 'Moderate', description: '1-4 hours' },
  high: { color: 'text-red-400', label: 'Significant', description: '4+ hours' },
};

// Map numeric priority to string key
const getPriorityKey = (priority: number): Priority => {
  if (priority >= 5) return 'critical';
  if (priority >= 4) return 'high';
  if (priority >= 3) return 'medium';
  if (priority >= 2) return 'low';
  return 'opportunity';
};

function ActionItemCard({ item, expanded, onToggle }: { 
  item: ActionItem; 
  expanded: boolean;
  onToggle: () => void;
}) {
  const priorityKey = getPriorityKey(item.priority);
  const priority = priorityConfig[priorityKey];
  const effort = effortConfig[item.effort];
  
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${priority.border} ${expanded ? 'ring-1 ring-cyan-500/30' : ''}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-start gap-4 ${priority.bg} hover:bg-zinc-800/50 transition-colors text-left`}
      >
        <div className={`p-2 rounded-lg ${priority.bg} ${priority.color} flex-shrink-0`}>
          {priorityKey === 'critical' ? (
            <AlertTriangle className="w-5 h-5" />
          ) : priorityKey === 'opportunity' ? (
            <Zap className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${priority.bg} ${priority.color}`}>
              {priority.label}
            </span>
            <span className="text-xs text-zinc-500">{item.category}</span>
          </div>
          
          <h4 className="text-white font-medium">{item.title}</h4>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-400">Impact: </span>
              <span className={item.impact >= 7 ? 'text-emerald-400' : item.impact >= 4 ? 'text-cyan-400' : 'text-zinc-400'}>
                {item.impact >= 7 ? 'High' : item.impact >= 4 ? 'Medium' : 'Low'} ({item.impact}/10)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-400">Effort: </span>
              <span className={effort.color}>{effort.label}</span>
            </div>
            {item.estimatedTime && (
              <span className="text-zinc-500">{item.estimatedTime}</span>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-500" />
          )}
        </div>
      </button>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 space-y-4">
          {/* Affected Pages */}
          {item.affectedPages && item.affectedPages.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">Affected Pages</h5>
              <div className="flex flex-wrap gap-2">
                {item.affectedPages.map((page, i) => (
                  <code key={i} className="px-2 py-1 bg-zinc-800 text-xs text-cyan-400 rounded">
                    {page}
                  </code>
                ))}
              </div>
            </div>
          )}
          
          {/* How to Fix */}
          {item.howToFix && item.howToFix.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">How to Fix</h5>
              <ol className="space-y-2">
                {item.howToFix.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-medium">
                      {i + 1}
                    </span>
                    <span className="text-zinc-400">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Recommendation */}
          {item.recommendation && (
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">Recommendation</h5>
              <p className="text-sm text-zinc-400">{item.recommendation}</p>
            </div>
          )}
          
          {/* Resources */}
          {item.resources && item.resources.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-zinc-300 mb-2">Learn More</h5>
              <div className="flex flex-wrap gap-2">
                {item.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-cyan-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {resource.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function RecommendationsPanel({ 
  items, 
  title = "Recommendations",
  showSearch = true,
  showGrouping = true,
  maxItems
}: RecommendationsPanelProps) {
  const [search, setSearch] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('priority');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  
  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };
  
  const filteredItems = useMemo(() => {
    let result = items;
    
    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(item => getPriorityKey(item.priority) === priorityFilter);
    }
    
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower)
      );
    }
    
    // Limit
    if (maxItems) {
      result = result.slice(0, maxItems);
    }
    
    return result;
  }, [items, priorityFilter, search, maxItems]);
  
  const groupedItems = useMemo(() => {
    const groups: Record<string, ActionItem[]> = {};
    
    filteredItems.forEach(item => {
      let key: string;
      switch (groupBy) {
        case 'priority':
          key = getPriorityKey(item.priority);
          break;
        case 'category':
          key = item.category;
          break;
        case 'effort':
          key = item.effort;
          break;
        default:
          key = getPriorityKey(item.priority);
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });
    
    // Sort groups by priority order if grouping by priority
    if (groupBy === 'priority') {
      const order = ['critical', 'high', 'medium', 'low', 'opportunity'];
      return Object.fromEntries(
        order.filter(key => groups[key]).map(key => [key, groups[key]])
      );
    }
    
    return groups;
  }, [filteredItems, groupBy]);
  
  // Summary stats
  const stats = useMemo(() => ({
    total: items.length,
    critical: items.filter(i => getPriorityKey(i.priority) === 'critical').length,
    high: items.filter(i => getPriorityKey(i.priority) === 'high').length,
    opportunities: items.filter(i => getPriorityKey(i.priority) === 'opportunity').length,
    quickWins: items.filter(i => i.effort === 'low' && i.impact >= 7).length,
  }), [items]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-zinc-500 mt-1">
            {stats.total} recommendations • {stats.critical} critical • {stats.quickWins} quick wins
          </p>
        </div>
        
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recommendations..."
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50"
            />
          </div>
        )}
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Priority Filter */}
        <div className="flex items-center gap-2 bg-zinc-900/50 rounded-lg p-1">
          {['all', 'critical', 'high', 'medium', 'low', 'opportunity'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p as Priority | 'all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                priorityFilter === p 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'All' : priorityConfig[p as Priority]?.label || p}
            </button>
          ))}
        </div>
        
        {/* Group By */}
        {showGrouping && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-zinc-500">Group by:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="priority">Priority</option>
              <option value="category">Category</option>
              <option value="effort">Effort</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Grouped Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group}>
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {groupBy === 'priority' && priorityConfig[group as Priority] && (
                <span className={`w-2 h-2 rounded-full ${priorityConfig[group as Priority].bg.replace('/10', '')}`} />
              )}
              {groupBy === 'priority' ? priorityConfig[group as Priority]?.label : group}
              <span className="text-zinc-600">({groupItems.length})</span>
            </h3>
            
            <div className="space-y-3">
              {groupItems.map((item) => (
                <ActionItemCard
                  key={item.id}
                  item={item}
                  expanded={expandedIds.has(item.id)}
                  onToggle={() => toggleExpanded(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {search ? 'No matching recommendations' : 'No issues found!'}
          </h3>
          <p className="text-zinc-400 text-sm">
            {search 
              ? 'Try adjusting your search terms' 
              : 'Your website looks great!'}
          </p>
        </div>
      )}
    </div>
  );
}
