import { Request, Response } from 'express';
import * as adminEnhancedService from '../services/admin.enhanced.service';
import { uploadIcon, handleUploadError } from '../middleware/upload';

// ============================================================================
// PLATFORM MANAGEMENT CONTROLLERS
// ============================================================================

export const getPlatforms = async (req: Request, res: Response) => {
  try {
    const { search, isActive, page, limit } = req.query;

    const filters = {
      search: search as string,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminEnhancedService.getPlatforms(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting platforms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platforms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createPlatform = async (req: Request, res: Response) => {
  try {
    const platformData = req.body;
    const platform = await adminEnhancedService.createPlatform(platformData);
    res.status(201).json({ success: true, data: platform });
  } catch (error) {
    console.error('Error creating platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updatePlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const platformData = req.body;
    const platform = await adminEnhancedService.updatePlatform(id, platformData);
    res.status(200).json({ success: true, data: platform });
  } catch (error) {
    console.error('Error updating platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deletePlatform = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminEnhancedService.deletePlatform(id);
    res.status(200).json({ success: true, message: 'Platform deleted successfully' });
  } catch (error) {
    console.error('Error deleting platform:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete platform',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const togglePlatformStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedPlatform = await adminEnhancedService.updatePlatform(id, { isActive });
    res.status(200).json({
      success: true,
      data: updatedPlatform,
      message: `Platform ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling platform status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle platform status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// CATEGORY MANAGEMENT CONTROLLERS
// ============================================================================

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { platformId, search, isActive, page, limit } = req.query;

    const filters = {
      platformId: platformId as string,
      search: search as string,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminEnhancedService.getCategories(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    const category = await adminEnhancedService.createCategory(categoryData);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const category = await adminEnhancedService.updateCategory(id, categoryData);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminEnhancedService.deleteCategory(id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleCategoryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedCategory = await adminEnhancedService.updateCategory(id, { isActive });
    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: `Category ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling category status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle category status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// SERVICE SLOT MANAGEMENT CONTROLLERS
// ============================================================================

export const getServiceSlots = async (req: Request, res: Response) => {
  try {
    const { platformId, categoryId, search, isActive, page, limit } = req.query;

    const filters = {
      platformId: platformId as string,
      categoryId: categoryId as string,
      search: search as string,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminEnhancedService.getServiceSlots(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting service slots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service slots',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createServiceSlot = async (req: Request, res: Response) => {
  try {
    const serviceSlotData = req.body;
    const serviceSlot = await adminEnhancedService.createServiceSlot(serviceSlotData);
    res.status(201).json({ success: true, data: serviceSlot });
  } catch (error) {
    console.error('Error creating service slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service slot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateServiceSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceSlotData = req.body;
    const serviceSlot = await adminEnhancedService.updateServiceSlot(id, serviceSlotData);
    res.status(200).json({ success: true, data: serviceSlot });
  } catch (error) {
    console.error('Error updating service slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service slot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteServiceSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminEnhancedService.deleteServiceSlot(id);
    res.status(200).json({ success: true, message: 'Service slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting service slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service slot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleServiceSlotStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedServiceSlot = await adminEnhancedService.updateServiceSlot(id, { isActive });
    res.status(200).json({
      success: true,
      data: updatedServiceSlot,
      message: `Service slot ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling service slot status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle service slot status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const duplicateServiceSlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get the original service slot
    const result = await adminEnhancedService.getServiceSlots({ page: 1, limit: 1 });
    const originalSlot = result.serviceSlots.find(slot => slot.id === id);

    if (!originalSlot) {
      return res.status(404).json({
        success: false,
        message: 'Service slot not found'
      });
    }

    // Create duplicate with modified name
    const duplicateData = {
      ...originalSlot,
      name: `${originalSlot.name} (복사본)`,
      isActive: false, // Start duplicates as inactive
      totalOrders: 0,
      totalRevenue: 0
    };

    delete duplicateData.id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;

    const duplicatedServiceSlot = await adminEnhancedService.createServiceSlot(duplicateData);

    res.status(201).json({
      success: true,
      data: duplicatedServiceSlot,
      message: 'Service slot duplicated successfully'
    });
  } catch (error) {
    console.error('Error duplicating service slot:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate service slot',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// ICON UPLOAD CONTROLLERS
// ============================================================================

export const uploadIconAsset = (req: Request, res: Response) => {
  uploadIcon(req, res, async (err) => {
    if (err) {
      return handleUploadError(err, req, res, () => {});
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '업로드할 파일이 없습니다.',
          error: 'NO_FILE'
        });
      }

      const iconAsset = await adminEnhancedService.createIconAsset(req.file);

      res.status(201).json({
        success: true,
        data: iconAsset,
        message: 'Icon uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading icon:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload icon',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
};

export const getIconAssets = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

    const filters = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 50,
    };

    const result = await adminEnhancedService.getIconAssets(filters);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error getting icon assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get icon assets',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteIconAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminEnhancedService.deleteIconAsset(id);
    res.status(200).json({ success: true, message: 'Icon asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting icon asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete icon asset',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

export const bulkUpdateStatus = async (req: Request, res: Response) => {
  try {
    const { ids, isActive, type } = req.body; // type: 'platform', 'category', 'serviceSlot'

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No IDs provided'
      });
    }

    const results = [];
    for (const id of ids) {
      try {
        let result;
        switch (type) {
          case 'platform':
            result = await adminEnhancedService.updatePlatform(id, { isActive });
            break;
          case 'category':
            result = await adminEnhancedService.updateCategory(id, { isActive });
            break;
          case 'serviceSlot':
            result = await adminEnhancedService.updateServiceSlot(id, { isActive });
            break;
          default:
            throw new Error('Invalid type');
        }
        results.push({ id, success: true, data: result });
      } catch (error) {
        results.push({
          id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.status(200).json({
      success: true,
      message: `Bulk update completed. ${successCount} successful, ${failCount} failed.`,
      results
    });
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk update',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
