import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useCategories } from '../../lib/hooks/useDatabase';
import { useAlert } from '../context/AlertProvider';
import { Spinner } from '../ui/Spinner';

export const CategoryManager: React.FC = () => {
  const { categories, addCategory, deleteCategory, isLoading } = useCategories();
  const showAlert = useAlert();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      await addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add category:', error);
      showAlert({
        title: 'Add Failed',
        message: 'Could not add category. Please try again.'
      });
    }
  };

  const handleStartEdit = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = async () => {
    if (!editingName.trim() || editingId === null) return;
    
    try {
      const { db } = await import('@/lib/db');
      await db.categories.update(editingId, { 
        name: editingName.trim()
      });
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Failed to update category:', error);
      showAlert({
        title: 'Update Failed',
        message: 'Could not rename category. Please try again.'
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    showAlert({
      title: `Delete "${name}"`,
      message: 'Transactions with this category will keep the category name.',
      actions: [
        {
          label: 'Delete',
          variant: 'danger',
          onPress: async () => {
            try {
              await deleteCategory(id);
            } catch (error) {
              console.error('Failed to delete category:', error);
              setTimeout(() => {
                showAlert({
                  title: 'Delete Failed',
                  message: 'Could not delete category. Please try again.'
                });
              }, 0);
            }
          }
        },
        { label: 'Cancel' }
      ]
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="w-6 h-6 text-[#8E8E93]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Category List */}
      <div className="bg-[#1C1C1E] rounded-[10px] overflow-hidden">
        {categories.map((category, index) => (
          <React.Fragment key={category.id}>
            {editingId === category.id ? (
              // Edit Mode
              <div className="flex items-center gap-2 px-4 py-3" style={{ minHeight: '44px' }}>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 bg-[#2C2C2E] text-white px-3 py-2 rounded-[8px] text-[15px] tracking-[-0.24px] outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') {
                      setEditingId(null);
                      setEditingName('');
                    }
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center active:opacity-60 transition-opacity"
                >
                  <Check size={16} className="text-white" />
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditingName('');
                  }}
                  className="w-8 h-8 rounded-full bg-[#8E8E93] flex items-center justify-center active:opacity-60 transition-opacity"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center gap-3 px-4 py-3" style={{ minHeight: '44px' }}>
                <span className="flex-1 text-[17px] text-white tracking-[-0.41px]">
                  {category.name}
                </span>
                <button
                  onClick={() => handleStartEdit(category.id!, category.name)}
                  className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center active:opacity-60 transition-opacity"
                >
                  <Pencil size={14} className="text-[#007AFF]" />
                </button>
                <button
                  onClick={() => handleDelete(category.id!, category.name)}
                  className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center active:opacity-60 transition-opacity"
                >
                  <Trash2 size={14} className="text-[#FF3B30]" />
                </button>
              </div>
            )}
            {index < categories.length - 1 && (
              <div className="h-[0.5px] bg-[#38383A] ml-4" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Add New Category */}
      {isAdding ? (
        <div className="bg-[#1C1C1E] rounded-[10px] p-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 bg-[#2C2C2E] text-white px-3 py-2 rounded-[8px] text-[15px] tracking-[-0.24px] outline-none placeholder-[#8E8E93]"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory();
                if (e.key === 'Escape') {
                  setIsAdding(false);
                  setNewCategoryName('');
                }
              }}
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center active:opacity-60 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check size={16} className="text-white" />
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName('');
              }}
              className="w-8 h-8 rounded-full bg-[#8E8E93] flex items-center justify-center active:opacity-60 transition-opacity"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full bg-[#1C1C1E] rounded-[10px] px-4 py-3 flex items-center gap-3 active:bg-[#2C2C2E] transition-colors"
          style={{ minHeight: '44px' }}
        >
          <div className="w-[29px] h-[29px] rounded-[7px] bg-[#34C759] flex items-center justify-center flex-shrink-0">
            <Plus size={16} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="flex-1 text-left text-[17px] text-white tracking-[-0.41px]">
            Add Category
          </span>
        </button>
      )}
    </div>
  );
};
