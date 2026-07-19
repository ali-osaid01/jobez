'use client';

import { useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from '@/lib/store/api/notificationsApi';

export function NotificationsMenu() {
  const seenIdsRef = useRef<Set<string> | null>(null);
  const { data } = useGetNotificationsQuery(
    { page: 1, limit: 10 },
    { pollingInterval: 10000 },
  );
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  useEffect(() => {
    if (!data) return;
    const currentIds = new Set(notifications.map((notification) => notification.id));
    if (!seenIdsRef.current) {
      seenIdsRef.current = currentIds;
      return;
    }

    const freshUnread = notifications.filter(
      (notification) => !notification.readAt && !seenIdsRef.current?.has(notification.id),
    );
    freshUnread.forEach((notification) => {
      toast(notification.title, {
        description: notification.message,
      });
    });
    seenIdsRef.current = currentIds;
  }, [data, notifications]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            disabled={unreadCount === 0 || isMarkingAll}
            onClick={() => markAllRead()}
          >
            <CheckCheck className="h-4 w-4" />
            Mark read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className="block w-full border-b p-3 text-left transition-colors hover:bg-muted/60"
                onClick={() => {
                  if (!notification.readAt) {
                    void markRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.readAt && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                </div>
                <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{notification.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
