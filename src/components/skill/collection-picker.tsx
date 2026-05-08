"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";
import type { UserCollection } from "@/lib/types";

interface CollectionPickerProps {
  collections: UserCollection[];
  skillId: string;
  skillName: string;
  onAddToCollection: (collectionId: string, skillId: string) => void;
  onCreateCollection: (name: string, description: string) => UserCollection | null;
  onSuccess: (message: string) => void;
}

export function CollectionPicker({
  collections,
  skillId,
  skillName,
  onAddToCollection,
  onCreateCollection,
  onSuccess,
}: CollectionPickerProps) {
  const { t } = useI18n();
  const [showCollections, setShowCollections] = useState(false);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  return (
    <div className="glass-card p-5">
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-border text-foreground hover:bg-secondary"
          onClick={() => setShowCollections(!showCollections)}
        >
          {t.common.addToCollection}
          <ChevronDown className="h-3.5 w-3.5 ml-auto" />
        </Button>
        {showCollections && (
          <div className="absolute z-20 bottom-full mb-1 left-0 w-full glass-card border border-border rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-48 overflow-y-auto">
              {collections.length > 0 ? (
                collections.map((col) => (
                  <button
                    key={col.id}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors text-foreground"
                    onClick={() => {
                      onAddToCollection(col.id, skillId);
                      setShowCollections(false);
                      onSuccess(`${skillName} → ${col.name}`);
                    }}
                  >
                    {col.name}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-muted-foreground">{t.common.noData}</p>
              )}
            </div>
            <div className="border-t border-border">
              {showNewCollection ? (
                <div className="p-2 flex gap-1">
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder={t.common.collectionName}
                    className="flex-1 px-2 py-1 text-xs bg-secondary border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      if (newCollectionName.trim()) {
                        const col = onCreateCollection(newCollectionName.trim(), "");
                        if (!col) return;
                        onAddToCollection(col.id, skillId);
                        setNewCollectionName("");
                        setShowNewCollection(false);
                        setShowCollections(false);
                        onSuccess(`${skillName} → ${col.name}`);
                      }
                    }}
                  >
                    {t.common.confirm}
                  </Button>
                </div>
              ) : (
                <button
                  className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-secondary transition-colors"
                  onClick={() => setShowNewCollection(true)}
                >
                  + {t.common.newCollection}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
