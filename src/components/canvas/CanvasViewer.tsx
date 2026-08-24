import { motion } from 'motion/react';
import type { PublicationSnapshot } from '../../domain/invite/types';
import type { ElementInstance } from '../../domain/element/types';
import { RsvpBlock } from './RsvpBlock';
import { LedgerBlock } from './LedgerBlock';

interface CanvasViewerProps {
  snapshot: PublicationSnapshot;
}

export function CanvasViewer({ snapshot }: CanvasViewerProps) {
  const { pages, elements } = snapshot;
  const sortedPages = [...pages].sort((a, b) => a.order - b.order);

  const renderElement = (el: ElementInstance) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      zIndex: el.z,
    };

    switch (el.type) {
      case 'text':
        return (
          <div key={el.id} style={style} className="flex items-center justify-center font-serif text-center">
            {(el.content?.text as string) || 'Text Element'}
          </div>
        );
      case 'photo':
        return (
          <div key={el.id} style={style} className="overflow-hidden rounded-lg bg-slate-200">
            {el.content?.url ? (
              <img src={el.content.url as string} alt="Element" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">Photo</div>
            )}
          </div>
        );
      case 'spotify':
        return (
          <div key={el.id} style={style} className="rounded overflow-hidden">
            <iframe 
              src={(el.content?.url as string) || 'https://open.spotify.com/embed/track/3n3Ppam7vgaBgEoMnPNsIl'} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="encrypted-media"
            ></iframe>
          </div>
        );
      case 'map':
        return (
          <div key={el.id} style={style} className="rounded overflow-hidden">
            <iframe
              src={(el.content?.url as string) || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15224.999272365287!2d78.4729112!3d17.4477464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a3fa271f2a3%3A0x633da5629199d799!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000'}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        );
      case 'rsvp':
        return (
          <div key={el.id} style={style}>
            <RsvpBlock slug={snapshot.invite.slug} />
          </div>
        );
      case 'upi_qr':
        return (
          <div key={el.id} style={style}>
            <LedgerBlock 
              slug={snapshot.invite.slug} 
              qrUrl={el.content?.url as string} 
              upiId={el.content?.upiId as string} 
            />
          </div>
        );
      // Other types would be implemented similarly
      default:
        return (
          <div key={el.id} style={style} className="bg-slate-100 border border-slate-300 flex items-center justify-center text-xs text-slate-400">
            {el.type}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 space-y-8">
      {sortedPages.map((page, index) => (
        <motion.div 
          key={page.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="relative overflow-hidden shadow-2xl bg-white w-full max-w-[400px] h-[700px]"
          style={{ backgroundColor: page.backgroundColor || '#ffffff' }}
        >
          {elements[page.id]?.map(renderElement)}
        </motion.div>
      ))}
      
      {/* Watermark for free/basic tier */}
      {snapshot.invite.tier === 'free' && (
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg text-[10px] font-bold tracking-wider uppercase text-slate-500 pointer-events-none">
          Made with <span className="text-rose-600">Yours Lovingly</span>
        </div>
      )}
    </div>
  );
}
