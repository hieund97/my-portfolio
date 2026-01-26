import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HiCheck, HiClock, HiMail, HiTrash } from 'react-icons/hi';
import { messagesService } from '../../services/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await messagesService.getAll();
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleMarkAsRead = async (id) => {
    await messagesService.markAsRead(id);
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
    if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, read: true });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await messagesService.delete(id);
    setMessages(messages.filter(m => m.id !== id));
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Messages</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages list */}
        <div className="space-y-3">
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => { setSelectedMessage(msg); if (!msg.read) handleMarkAsRead(msg.id); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedMessage?.id === msg.id ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 
                'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600'
              } ${!msg.read ? 'ring-2 ring-primary-500/20' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${!msg.read ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                  <HiMail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium truncate ${!msg.read ? 'text-primary-600 dark:text-primary-400' : ''}`}>{msg.name}</p>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                  <p className="text-sm text-slate-500 truncate">{msg.email}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-1">{msg.subject || msg.message?.slice(0, 50)}</p>
                </div>
              </div>
            </motion.div>
          ))}
          {!messages.length && <p className="text-center py-12 text-slate-500">No messages yet.</p>}
        </div>

        {/* Selected message */}
        <div className="lg:sticky lg:top-24 h-fit">
          {selectedMessage ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{selectedMessage.name}</h3>
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary-600 hover:underline">{selectedMessage.email}</a>
                </div>
                <div className="flex gap-2">
                  {!selectedMessage.read && <button onClick={() => handleMarkAsRead(selectedMessage.id)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-green-600"><HiCheck className="w-5 h-5" /></button>}
                  <button onClick={() => handleDelete(selectedMessage.id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"><HiTrash className="w-5 h-5" /></button>
                </div>
              </div>
              {selectedMessage.subject && <p className="font-medium mb-3">{selectedMessage.subject}</p>}
              <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{selectedMessage.message}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500">
                <HiClock className="w-4 h-4" />
                {formatDate(selectedMessage.createdAt)}
              </div>
            </motion.div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center text-slate-500">
              <HiMail className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
