import React, { useRef, useEffect } from 'react';
import { useTransition, animated } from 'react-spring';
import DOMPurify from 'dompurify';
import { Download } from 'lucide-react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onDownload: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, onDownload }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const messageTransitions = useTransition(messages, {
    keys: item => item.id,
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
  });

  const isTripSummary = (content: string) => {
    return content.includes("Trip Summary:") || content.includes("Daily Itinerary:");
  };

  return (
    <div className="flex-grow overflow-auto space-y-4 mb-4 max-w-5xl mx-auto w-full">
      {messageTransitions((style, item) => (
        <animated.div style={style} className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-3xl p-3 ${
            item.type === 'user' 
              ? 'bg-white text-black' 
              : item.type === 'system' 
                ? 'bg-gray-800' 
                : 'bg-gray-900'
          }`}>
            {typeof item.content === 'string' 
              ? item.content.split('\n').map((line, index) => {
                  const boldRegex = /\*\*([^*]+)\*\*/g;
                  const boldReplacedLine = line.replace(boldRegex, '<strong>$1</strong>');
                  const sanitizedContent = DOMPurify.sanitize(boldReplacedLine);

                  return (
                    <React.Fragment key={index}>
                      {line.includes('Day') ? (
                        <div className="mt-4 font-bold">
                          <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        </div>
                      ) : line.includes('Activities:') ? (
                        <div className="ml-4 mt-2">
                          <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        </div>
                      ) : line.includes('Meals:') || line.includes('Transportation:') ? (
                        <div className="ml-8">
                          <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        </div>
                      ) : (
                        <div>
                          <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              : item.content
            }
            {item.images && item.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {item.images.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img src={img.url} alt={`Travel ${index + 1}`} className="rounded-lg w-full h-auto" />
                  </div>
                ))}
              </div>
            )}
            {item.type === 'bot' && isTripSummary(item.content as string) && (
              <button
                onClick={() => onDownload(item)}
                className="mt-2 flex items-center justify-center bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            )}
          </div>
        </animated.div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-3xl p-3 bg-gray-900">
            Planning your perfect trip...
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;