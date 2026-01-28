"use client";

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { TreeView, TreeNode } from '@/components/ui/tree-view';
import { MOCK_INVENTORY } from '@/lib/mock-inventory';
import { ResourceDetails } from '@/components/features/inventory/resource-details';
import { Card } from '@/components/ui/card';

export default function InventoryPage() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-4">
        {/* Left Pane: Tree Explorer */}
        <Card className="w-1/3 flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h2 className="font-semibold text-lg">탐색기</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <TreeView 
              data={MOCK_INVENTORY} 
              onSelect={setSelectedNode} 
            />
          </div>
        </Card>

        {/* Right Pane: Details */}
        <div className="flex-1 overflow-y-auto">
          <ResourceDetails node={selectedNode} />
        </div>
      </div>
    </MainLayout>
  );
}
