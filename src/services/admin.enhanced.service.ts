import { PrismaClient } from '@prisma/client';
import { generateFileUrl, deleteUploadedFile } from '../middleware/upload';
import path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// PLATFORM MANAGEMENT
// ============================================================================

export const getPlatforms = async (filters: any = {}) => {
  try {
    const { search, isActive, page = 1, limit = 50 } = filters;
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [platforms, total] = await Promise.all([
      prisma.platform.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        include: {
          iconAsset: true,
          categories: {
            include: {
              iconAsset: true,
              _count: {
                select: { serviceSlots: true }
              }
            }
          },
          _count: {
            select: {
              categories: true,
              serviceSlots: true,
              products: true
            }
          }
        }
      }),
      prisma.platform.count({ where })
    ]);

    return {
      platforms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting platforms:', error);
    throw new Error('Failed to get platforms');
  }
};

export const createPlatform = async (platformData: any) => {
  try {
    // Generate slug from name
    const slug = platformData.name
      .toLowerCase()
      .replace(/[^가-힣a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists
    const existingPlatform = await prisma.platform.findUnique({
      where: { slug }
    });

    if (existingPlatform) {
      throw new Error('이미 존재하는 플랫폼 이름입니다.');
    }

    const platform = await prisma.platform.create({
      data: {
        name: platformData.name,
        slug,
        icon: platformData.icon || null,
        iconAssetId: platformData.iconAssetId || null,
        color: platformData.color || '#000000',
        description: platformData.description || null,
        isActive: platformData.isActive ?? true,
        isVisible: platformData.isVisible ?? true,
        sortOrder: platformData.sortOrder || 0,
      },
      include: {
        iconAsset: true,
        _count: {
          select: {
            categories: true,
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    return platform;
  } catch (error) {
    console.error('Error creating platform:', error);
    throw error;
  }
};

export const updatePlatform = async (id: string, platformData: any) => {
  try {
    const updateData: any = {};

    // Update fields if provided
    if (platformData.name !== undefined) {
      updateData.name = platformData.name;
      // Regenerate slug if name changes
      updateData.slug = platformData.name
        .toLowerCase()
        .replace(/[^가-힣a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (platformData.icon !== undefined) updateData.icon = platformData.icon;
    if (platformData.iconAssetId !== undefined) updateData.iconAssetId = platformData.iconAssetId;
    if (platformData.color !== undefined) updateData.color = platformData.color;
    if (platformData.description !== undefined) updateData.description = platformData.description;
    if (platformData.isActive !== undefined) updateData.isActive = platformData.isActive;
    if (platformData.isVisible !== undefined) updateData.isVisible = platformData.isVisible;
    if (platformData.sortOrder !== undefined) updateData.sortOrder = platformData.sortOrder;

    const platform = await prisma.platform.update({
      where: { id },
      data: updateData,
      include: {
        iconAsset: true,
        _count: {
          select: {
            categories: true,
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    return platform;
  } catch (error) {
    console.error('Error updating platform:', error);
    throw new Error('Failed to update platform');
  }
};

export const deletePlatform = async (id: string) => {
  try {
    // Check if platform has dependencies
    const platform = await prisma.platform.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            categories: true,
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    if (!platform) {
      throw new Error('Platform not found');
    }

    const totalDependencies = platform._count.categories + platform._count.serviceSlots + platform._count.products;

    if (totalDependencies > 0) {
      throw new Error(`플랫폼을 삭제할 수 없습니다. ${totalDependencies}개의 연관된 항목이 있습니다.`);
    }

    await prisma.platform.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting platform:', error);
    throw error;
  }
};

// ============================================================================
// CATEGORY MANAGEMENT
// ============================================================================

export const getCategories = async (filters: any = {}) => {
  try {
    const { platformId, search, isActive, page = 1, limit = 50 } = filters;
    const where: any = {};

    if (platformId) {
      where.platformId = platformId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        include: {
          platform: true,
          iconAsset: true,
          _count: {
            select: {
              serviceSlots: true,
              products: true
            }
          }
        }
      }),
      prisma.category.count({ where })
    ]);

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting categories:', error);
    throw new Error('Failed to get categories');
  }
};

export const createCategory = async (categoryData: any) => {
  try {
    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^가-힣a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists for this platform
    const existingCategory = await prisma.category.findUnique({
      where: {
        platformId_slug: {
          platformId: categoryData.platformId,
          slug
        }
      }
    });

    if (existingCategory) {
      throw new Error('이 플랫폼에 이미 존재하는 카테고리 이름입니다.');
    }

    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        slug,
        platformId: categoryData.platformId,
        icon: categoryData.icon || null,
        iconAssetId: categoryData.iconAssetId || null,
        description: categoryData.description || null,
        isActive: categoryData.isActive ?? true,
        isVisible: categoryData.isVisible ?? true,
        sortOrder: categoryData.sortOrder || 0,
      },
      include: {
        platform: true,
        iconAsset: true,
        _count: {
          select: {
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, categoryData: any) => {
  try {
    const updateData: any = {};

    if (categoryData.name !== undefined) {
      updateData.name = categoryData.name;
      updateData.slug = categoryData.name
        .toLowerCase()
        .replace(/[^가-힣a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (categoryData.platformId !== undefined) updateData.platformId = categoryData.platformId;
    if (categoryData.icon !== undefined) updateData.icon = categoryData.icon;
    if (categoryData.iconAssetId !== undefined) updateData.iconAssetId = categoryData.iconAssetId;
    if (categoryData.description !== undefined) updateData.description = categoryData.description;
    if (categoryData.isActive !== undefined) updateData.isActive = categoryData.isActive;
    if (categoryData.isVisible !== undefined) updateData.isVisible = categoryData.isVisible;
    if (categoryData.sortOrder !== undefined) updateData.sortOrder = categoryData.sortOrder;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        platform: true,
        iconAsset: true,
        _count: {
          select: {
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    return category;
  } catch (error) {
    console.error('Error updating category:', error);
    throw new Error('Failed to update category');
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    if (!category) {
      throw new Error('Category not found');
    }

    const totalDependencies = category._count.serviceSlots + category._count.products;

    if (totalDependencies > 0) {
      throw new Error(`카테고리를 삭제할 수 없습니다. ${totalDependencies}개의 연관된 항목이 있습니다.`);
    }

    await prisma.category.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ============================================================================
// SERVICE SLOT MANAGEMENT
// ============================================================================

export const getServiceSlots = async (filters: any = {}) => {
  try {
    const { platformId, categoryId, search, isActive, page = 1, limit = 50 } = filters;
    const where: any = {};

    if (platformId) {
      where.platformId = platformId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [serviceSlots, total] = await Promise.all([
      prisma.serviceSlot.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        include: {
          platform: true,
          category: true,
          iconAsset: true,
          _count: {
            select: { orders: true }
          }
        }
      }),
      prisma.serviceSlot.count({ where })
    ]);

    return {
      serviceSlots,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting service slots:', error);
    throw new Error('Failed to get service slots');
  }
};

export const createServiceSlot = async (serviceSlotData: any) => {
  try {
    // Generate slug from name
    const slug = serviceSlotData.name
      .toLowerCase()
      .replace(/[^가-힣a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Check if slug already exists for this platform and category
    const existingServiceSlot = await prisma.serviceSlot.findUnique({
      where: {
        platformId_categoryId_slug: {
          platformId: serviceSlotData.platformId,
          categoryId: serviceSlotData.categoryId,
          slug
        }
      }
    });

    if (existingServiceSlot) {
      throw new Error('이 플랫폼과 카테고리에 이미 존재하는 서비스 이름입니다.');
    }

    const serviceSlot = await prisma.serviceSlot.create({
      data: {
        name: serviceSlotData.name,
        slug,
        description: serviceSlotData.description || null,
        platformId: serviceSlotData.platformId,
        categoryId: serviceSlotData.categoryId,
        icon: serviceSlotData.icon || null,
        iconAssetId: serviceSlotData.iconAssetId || null,
        price: serviceSlotData.price,
        minQuantity: serviceSlotData.minQuantity || 1,
        maxQuantity: serviceSlotData.maxQuantity || 10000,
        unit: serviceSlotData.unit || '개',
        deliveryTime: serviceSlotData.deliveryTime || '1-24시간',
        quality: serviceSlotData.quality || 'standard',
        isActive: serviceSlotData.isActive ?? true,
        isVisible: serviceSlotData.isVisible ?? true,
        isPopular: serviceSlotData.isPopular ?? false,
        isRecommended: serviceSlotData.isRecommended ?? false,
        sortOrder: serviceSlotData.sortOrder || 0,
        features: serviceSlotData.features || [],
        warningNote: serviceSlotData.warningNote || null,
        totalOrders: serviceSlotData.totalOrders || 0,
        totalRevenue: serviceSlotData.totalRevenue || 0,
      },
      include: {
        platform: true,
        category: true,
        iconAsset: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    return serviceSlot;
  } catch (error) {
    console.error('Error creating service slot:', error);
    throw error;
  }
};

export const updateServiceSlot = async (id: string, serviceSlotData: any) => {
  try {
    const updateData: any = {};

    if (serviceSlotData.name !== undefined) {
      updateData.name = serviceSlotData.name;
      updateData.slug = serviceSlotData.name
        .toLowerCase()
        .replace(/[^가-힣a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Update all provided fields
    Object.keys(serviceSlotData).forEach(key => {
      if (key !== 'name' && serviceSlotData[key] !== undefined) {
        updateData[key] = serviceSlotData[key];
      }
    });

    const serviceSlot = await prisma.serviceSlot.update({
      where: { id },
      data: updateData,
      include: {
        platform: true,
        category: true,
        iconAsset: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    return serviceSlot;
  } catch (error) {
    console.error('Error updating service slot:', error);
    throw new Error('Failed to update service slot');
  }
};

export const deleteServiceSlot = async (id: string) => {
  try {
    const serviceSlot = await prisma.serviceSlot.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!serviceSlot) {
      throw new Error('Service slot not found');
    }

    if (serviceSlot._count.orders > 0) {
      throw new Error(`서비스를 삭제할 수 없습니다. ${serviceSlot._count.orders}개의 주문이 있습니다.`);
    }

    await prisma.serviceSlot.delete({
      where: { id }
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting service slot:', error);
    throw error;
  }
};

// ============================================================================
// ICON ASSET MANAGEMENT
// ============================================================================

export const createIconAsset = async (fileData: Express.Multer.File) => {
  try {
    const url = generateFileUrl(fileData.filename);

    const iconAsset = await prisma.iconAsset.create({
      data: {
        filename: fileData.originalname,
        filepath: fileData.path,
        url,
        mimeType: fileData.mimetype,
        fileSize: fileData.size,
        // Note: width and height would need image processing library to extract
      }
    });

    return iconAsset;
  } catch (error) {
    console.error('Error creating icon asset:', error);
    // If database save fails, delete the uploaded file
    deleteUploadedFile(fileData.path);
    throw new Error('Failed to save icon asset');
  }
};

export const getIconAssets = async (filters: any = {}) => {
  try {
    const { page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const [iconAssets, total] = await Promise.all([
      prisma.iconAsset.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              platforms: true,
              categories: true,
              serviceSlots: true,
              products: true
            }
          }
        }
      }),
      prisma.iconAsset.count()
    ]);

    return {
      iconAssets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting icon assets:', error);
    throw new Error('Failed to get icon assets');
  }
};

export const deleteIconAsset = async (id: string) => {
  try {
    const iconAsset = await prisma.iconAsset.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            platforms: true,
            categories: true,
            serviceSlots: true,
            products: true
          }
        }
      }
    });

    if (!iconAsset) {
      throw new Error('Icon asset not found');
    }

    const totalUsage = iconAsset._count.platforms + iconAsset._count.categories +
                       iconAsset._count.serviceSlots + iconAsset._count.products;

    if (totalUsage > 0) {
      throw new Error(`아이콘을 삭제할 수 없습니다. ${totalUsage}개의 항목에서 사용 중입니다.`);
    }

    // Delete from database first
    await prisma.iconAsset.delete({
      where: { id }
    });

    // Then delete the file
    deleteUploadedFile(iconAsset.filepath);

    return { success: true };
  } catch (error) {
    console.error('Error deleting icon asset:', error);
    throw error;
  }
};
