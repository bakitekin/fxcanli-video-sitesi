import React from 'react';
import { Bell, Mail, MessageSquare, PlayCircle } from 'lucide-react';

export type NotificationType = 'push' | 'email' | 'sms' | 'video';

const iconMap: Record<NotificationType, React.ReactNode> = {
  push: <Bell size={18} />, email: <Mail size={18} />, sms: <MessageSquare size={18} />, video: <PlayCircle size={18} />
};

export default function NotificationCard({
  type, title, body, time, unread = false, actionLabel, onAction
}: {
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}){
  return (
    <div className={`rounded-2xl border p-4 bg-white flex items-start gap-3 ${unread ? 'border-brand-orange' : ''}`}>
      <div className={`h-9 w-9 rounded-lg grid place-items-center ${unread ? 'bg-brand-orange/15 text-brand-orange' : 'bg-gray-100'}`}>{iconMap[type]}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{title}</h3>
          <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{type}</span>
          {unread && <span className="text-xs text-brand-orange">• yeni</span>}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{body}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">{time}</span>
          {actionLabel && (
            <button onClick={onAction} className="text-sm px-3 py-1.5 rounded-lg bg-brand-black text-white">{actionLabel}</button>
          )}
        </div>
      </div>
    </div>
  );
}
