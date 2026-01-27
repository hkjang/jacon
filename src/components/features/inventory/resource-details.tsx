"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TreeNode } from '@/components/ui/tree-view';

export function ResourceDetails({ node }: { node: TreeNode | null }) {
  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Select a resource from the explorer to view details
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {node.icon && <node.icon className="text-blue-500" />}
            {node.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-slate-400">ID:</span>
              <span className="ml-2 text-sm text-slate-200">{node.id}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-400">Type:</span>
              <span className="ml-2 text-sm text-slate-200">
                {node.children ? 'Container/Group' : 'Leaf Resource'}
              </span>
            </div>
            {/* Extended details would go here based on node type */}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-emerald-500 font-medium">Active / Running</div>
          <p className="text-sm text-slate-400 mt-2">
            Resource is healthy and responding to probes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
