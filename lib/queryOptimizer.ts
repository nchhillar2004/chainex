import prisma from './db';
import { logger } from './logger';
import { DatabaseOptimizer } from './db';

// Query optimization utilities
export class QueryOptimizer {
  // Optimized user queries
  static async getUserWithOptimizedRelations(userId: number) {
    return DatabaseOptimizer.executeWithMetrics(
      () => prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          fullname: true,
          avatarUrl: true,
          bio: true,
          experience: true,
          level: true,
          role: true,
          status: true,
          isVerified: true,
          country: true,
          timezone: true,
          createdAt: true,
          // Optimized relations with limited data
          communitiesCreated: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              _count: {
                select: {
                  members: true,
                  threads: true,
                },
              },
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          threads: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              chain: {
                select: {
                  name: true,
                  slug: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                  replies: true,
                },
              },
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: {
              communitiesCreated: true,
              threads: true,
              followsAsFollower: true,
              followsAsFollowed: true,
            },
          },
        },
      }),
      'getUserWithOptimizedRelations'
    );
  }

  // Optimized chain queries with pagination
  static async getChainsWithPagination(
    page: number = 1,
    limit: number = 20,
    userId?: number,
    filters?: {
      visibility?: 'PUBLIC' | 'PRIVATE';
      search?: string;
      tags?: string[];
    }
  ) {
    const offset = (page - 1) * limit;
    
    return DatabaseOptimizer.executeWithMetrics(
      async () => {
        const where: any = {
          deletedAt: null,
        };

        if (filters?.visibility) {
          where.visibility = filters.visibility;
        }

        if (filters?.search) {
          where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        if (filters?.tags && filters.tags.length > 0) {
          where.chainTags = {
            some: {
              tag: {
                name: { in: filters.tags },
              },
            },
          };
        }

        const [chains, totalCount] = await Promise.all([
          prisma.chain.findMany({
            where,
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              visibility: true,
              createdAt: true,
              creator: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                },
              },
              chainTags: {
                select: {
                  tag: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              _count: {
                select: {
                  members: true,
                  threads: true,
                  boosts: true,
                },
              },
            },
            orderBy: [
              { boosts: { _count: 'desc' } },
              { members: { _count: 'desc' } },
              { createdAt: 'desc' },
            ],
            take: limit,
            skip: offset,
          }),
          prisma.chain.count({ where }),
        ]);

        return {
          chains,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: page * limit < totalCount,
            hasPrev: page > 1,
          },
        };
      },
      'getChainsWithPagination'
    );
  }

  // Optimized thread queries with caching
  static async getThreadsWithOptimizedData(
    chainId?: number,
    page: number = 1,
    limit: number = 20,
    filter: 'top' | 'popular' | 'recent' = 'top'
  ) {
    const offset = (page - 1) * limit;
    
    return DatabaseOptimizer.executeWithMetrics(
      async () => {
        const where: any = {
          deletedAt: null,
        };

        if (chainId) {
          where.chainId = chainId;
        } else {
          where.chain = {
            visibility: 'PUBLIC',
          };
        }

        let orderBy: any = { createdAt: 'desc' };
        
        if (filter === 'top') {
          orderBy = { votes: { _count: 'desc' } };
        } else if (filter === 'popular') {
          orderBy = { replies: { _count: 'desc' } };
        }

        const [threads, totalCount] = await Promise.all([
          prisma.thread.findMany({
            where,
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  avatarUrl: true,
                  isVerified: true,
                  level: true,
                  role: true,
                },
              },
              chain: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
              votes: {
                select: {
                  userId: true,
                  voteType: true,
                },
              },
              threadTags: {
                select: {
                  tag: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
              pinnedThreads: {
                select: {
                  pinnedAt: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                  replies: true,
                },
              },
            },
            orderBy,
            take: limit,
            skip: offset,
          }),
          prisma.thread.count({ where }),
        ]);

        return {
          threads,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: page * limit < totalCount,
            hasPrev: page > 1,
          },
        };
      },
      'getThreadsWithOptimizedData'
    );
  }

  // Optimized search with full-text search
  static async searchWithOptimization(
    query: string,
    type: 'all' | 'chains' | 'threads' | 'users' = 'all',
    limit: number = 10
  ) {
    return DatabaseOptimizer.executeWithMetrics(
      async () => {
        const searchTerm = query.trim();
        const results: any = {};

        if (type === 'all' || type === 'chains') {
          results.chains = await prisma.chain.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
              ],
              visibility: 'PUBLIC',
              deletedAt: null,
            },
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              _count: {
                select: {
                  members: true,
                  threads: true,
                },
              },
            },
            take: limit,
            orderBy: { members: { _count: 'desc' } },
          });
        }

        if (type === 'all' || type === 'threads') {
          results.threads = await prisma.thread.findMany({
            where: {
              OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { content: { contains: searchTerm, mode: 'insensitive' } },
              ],
              deletedAt: null,
              chain: {
                visibility: 'PUBLIC',
              },
            },
            select: {
              id: true,
              title: true,
              createdAt: true,
              author: {
                select: {
                  username: true,
                },
              },
              chain: {
                select: {
                  name: true,
                  slug: true,
                },
              },
              _count: {
                select: {
                  votes: true,
                  replies: true,
                },
              },
            },
            take: limit,
            orderBy: { votes: { _count: 'desc' } },
          });
        }

        if (type === 'all' || type === 'users') {
          results.users = await prisma.user.findMany({
            where: {
              username: { contains: searchTerm, mode: 'insensitive' },
              status: 'ACTIVE',
            },
            select: {
              id: true,
              username: true,
              avatarUrl: true,
              isVerified: true,
              level: true,
              _count: {
                select: {
                  threads: true,
                  communitiesCreated: true,
                },
              },
            },
            take: limit,
            orderBy: { level: 'desc' },
          });
        }

        return results;
      },
      'searchWithOptimization'
    );
  }

  // Batch operations for better performance
  static async batchUpdateUserLevels(userIds: number[]) {
    return DatabaseOptimizer.executeWithMetrics(
      async () => {
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, experience: true },
        });

        const updates = users.map(user => {
          const newLevel = this.calculateLevel(user.experience);
          return prisma.user.update({
            where: { id: user.id },
            data: { level: newLevel },
          });
        });

        return Promise.all(updates);
      },
      'batchUpdateUserLevels'
    );
  }

  // Optimized analytics queries
  static async getPlatformAnalytics() {
    return DatabaseOptimizer.executeWithMetrics(
      async () => {
        const [
          totalUsers,
          verifiedUsers,
          totalChains,
          publicChains,
          totalThreads,
          activeUsers,
        ] = await Promise.all([
          prisma.user.count(),
          prisma.user.count({ where: { isVerified: true } }),
          prisma.chain.count({ where: { deletedAt: null } }),
          prisma.chain.count({ 
            where: { 
              visibility: 'PUBLIC', 
              deletedAt: null 
            } 
          }),
          prisma.thread.count({ where: { deletedAt: null } }),
          prisma.user.count({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
              },
            },
          }),
        ]);

        return {
          totalUsers,
          verifiedUsers,
          totalChains,
          publicChains,
          totalThreads,
          activeUsers,
          verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0,
        };
      },
      'getPlatformAnalytics'
    );
  }

  private static calculateLevel(experience: number): number {
    if (experience >= 15000) return 10;
    if (experience >= 11000) return 9;
    if (experience >= 8000) return 8;
    if (experience >= 5500) return 7;
    if (experience >= 3500) return 6;
    if (experience >= 2000) return 5;
    if (experience >= 1000) return 4;
    if (experience >= 500) return 3;
    if (experience >= 200) return 2;
    return 1;
  }
}

// Query caching utilities
export class QueryCache {
  private static cache = new Map<string, { data: any; expires: number }>();
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  static set(key: string, data: any, ttl: number = QueryCache.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static delete(key: string): void {
    this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    
    return `${prefix}:${sortedParams}`;
  }
}
