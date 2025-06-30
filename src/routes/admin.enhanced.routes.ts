import { Router } from 'express';
import * as adminEnhancedController from '../controllers/admin.enhanced.controller';

const router = Router();

// ============================================================================
// PLATFORM MANAGEMENT ROUTES
// ============================================================================

// Get all platforms
router.get('/platforms', adminEnhancedController.getPlatforms);

// Create new platform
router.post('/platforms', adminEnhancedController.createPlatform);

// Update platform
router.put('/platforms/:id', adminEnhancedController.updatePlatform);

// Delete platform
router.delete('/platforms/:id', adminEnhancedController.deletePlatform);

// Toggle platform status (activate/deactivate)
router.patch('/platforms/:id/toggle', adminEnhancedController.togglePlatformStatus);

// ============================================================================
// CATEGORY MANAGEMENT ROUTES
// ============================================================================

// Get all categories (optionally filtered by platform)
router.get('/categories', adminEnhancedController.getCategories);

// Create new category
router.post('/categories', adminEnhancedController.createCategory);

// Update category
router.put('/categories/:id', adminEnhancedController.updateCategory);

// Delete category
router.delete('/categories/:id', adminEnhancedController.deleteCategory);

// Toggle category status (activate/deactivate)
router.patch('/categories/:id/toggle', adminEnhancedController.toggleCategoryStatus);

// ============================================================================
// SERVICE SLOT MANAGEMENT ROUTES
// ============================================================================

// Get all service slots (optionally filtered by platform/category)
router.get('/service-slots', adminEnhancedController.getServiceSlots);

// Create new service slot
router.post('/service-slots', adminEnhancedController.createServiceSlot);

// Update service slot
router.put('/service-slots/:id', adminEnhancedController.updateServiceSlot);

// Delete service slot
router.delete('/service-slots/:id', adminEnhancedController.deleteServiceSlot);

// Toggle service slot status (activate/deactivate)
router.patch('/service-slots/:id/toggle', adminEnhancedController.toggleServiceSlotStatus);

// Duplicate service slot
router.post('/service-slots/:id/duplicate', adminEnhancedController.duplicateServiceSlot);

// ============================================================================
// ICON UPLOAD ROUTES
// ============================================================================

// Upload icon file
router.post('/upload/icon', adminEnhancedController.uploadIconAsset);

// Get all icon assets
router.get('/icons', adminEnhancedController.getIconAssets);

// Delete icon asset
router.delete('/icons/:id', adminEnhancedController.deleteIconAsset);

// ============================================================================
// BULK OPERATIONS ROUTES
// ============================================================================

// Bulk update status for multiple items
router.patch('/bulk/status', adminEnhancedController.bulkUpdateStatus);

// ============================================================================
// UTILITY ROUTES
// ============================================================================

// Health check for enhanced admin API
router.get('/enhanced/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Enhanced Admin API is healthy',
    timestamp: new Date().toISOString(),
    features: {
      platformManagement: true,
      categoryManagement: true,
      serviceSlotManagement: true,
      iconUpload: true,
      bulkOperations: true,
    }
  });
});

export default router;
