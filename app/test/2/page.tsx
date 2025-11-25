// "use client";
// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Search,
//   MoreVertical,
//   Send,
//   Paperclip,
//   Smile,
//   Check,
//   CheckCheck,
//   X,
//   UserPlus,
//   Moon,
//   Sun,
//   Menu,
//   Phone,
//   Video,
//   Pin,
// } from "lucide-react";

// // Dummy Data
// const dummyChats = [
//   {
//     id: "1",
//     name: "John Doe",
//     avatar: "JD",
//     unread: 2,
//     lastMessage: "Hey! What's up?",
//     lastMessageTime: "10:25 AM",
//     isOnline: true,
//     isPinned: true,
//     type: "individual",
//     messages: [
//       {
//         id: "m1",
//         from: "them",
//         type: "text",
//         content: "Hey! What's up?",
//         time: "10:21 AM",
//         seen: true,
//       },
//       {
//         id: "m2",
//         from: "me",
//         type: "text",
//         content: "Not much, just working on a project",
//         time: "10:23 AM",
//         seen: true,
//       },
//       {
//         id: "m3",
//         from: "them",
//         type: "text",
//         content: "Cool! What kind of project?",
//         time: "10:25 AM",
//         seen: false,
//       },
//     ],
//   },
//   {
//     id: "2",
//     name: "Design Team",
//     avatar: "DT",
//     unread: 5,
//     lastMessage: "Sarah: Let's schedule a meeting",
//     lastMessageTime: "9:45 AM",
//     isOnline: false,
//     isPinned: true,
//     type: "group",
//     participants: ["Sarah", "Mike", "Emma", "You"],
//     messages: [
//       {
//         id: "m1",
//         from: "Sarah",
//         type: "text",
//         content: "Let's schedule a meeting",
//         time: "9:45 AM",
//         seen: true,
//       },
//       {
//         id: "m2",
//         from: "Mike",
//         type: "text",
//         content: "Sure, when works for everyone?",
//         time: "9:46 AM",
//         seen: true,
//       },
//     ],
//   },
//   {
//     id: "3",
//     name: "Alice Smith",
//     avatar: "AS",
//     unread: 0,
//     lastMessage: "Thanks for your help!",
//     lastMessageTime: "Yesterday",
//     isOnline: false,
//     isPinned: false,
//     type: "individual",
//     messages: [
//       {
//         id: "m1",
//         from: "them",
//         type: "text",
//         content: "Can you help me with the design?",
//         time: "Yesterday 2:15 PM",
//         seen: true,
//       },
//       {
//         id: "m2",
//         from: "me",
//         type: "text",
//         content: "Of course! What do you need?",
//         time: "Yesterday 2:16 PM",
//         seen: true,
//       },
//       {
//         id: "m3",
//         from: "them",
//         type: "text",
//         content: "Thanks for your help!",
//         time: "Yesterday 3:45 PM",
//         seen: true,
//       },
//     ],
//   },
//   {
//     id: "4",
//     name: "Family Group",
//     avatar: "FG",
//     unread: 0,
//     lastMessage: "Mom: Dinner at 7pm",
//     lastMessageTime: "Yesterday",
//     isOnline: false,
//     isPinned: false,
//     type: "group",
//     participants: ["Mom", "Dad", "Sister", "You"],
//     messages: [
//       {
//         id: "m1",
//         from: "Mom",
//         type: "text",
//         content: "Dinner at 7pm",
//         time: "Yesterday 5:30 PM",
//         seen: true,
//       },
//     ],
//   },
//   {
//     id: "5",
//     name: "Bob Johnson",
//     avatar: "BJ",
//     unread: 0,
//     lastMessage: "See you tomorrow!",
//     lastMessageTime: "2 days ago",
//     isOnline: false,
//     isPinned: false,
//     type: "individual",
//     messages: [
//       {
//         id: "m1",
//         from: "them",
//         type: "text",
//         content: "Are we still on for coffee?",
//         time: "2 days ago 11:00 AM",
//         seen: true,
//       },
//       {
//         id: "m2",
//         from: "me",
//         type: "text",
//         content: "Yes! See you tomorrow!",
//         time: "2 days ago 11:05 AM",
//         seen: true,
//       },
//       {
//         id: "m3",
//         from: "them",
//         type: "text",
//         content: "See you tomorrow!",
//         time: "2 days ago 11:06 AM",
//         seen: true,
//       },
//     ],
//   },
// ];

// // Types
// interface Message {
//   id: string;
//   from: string;
//   type: "text" | "image" | "file";
//   content: string;
//   time: string;
//   seen: boolean;
//   reactions?: string[];
//   replyTo?: string;
// }

// interface Chat {
//   id: string;
//   name: string;
//   avatar: string;
//   unread: number;
//   lastMessage: string;
//   lastMessageTime: string;
//   isOnline: boolean;
//   isPinned: boolean;
//   type: "individual" | "group";
//   participants?: string[];
//   messages: Message[];
// }

// // Avatar Component
// const Avatar = ({
//   name,
//   size = "md",
//   isOnline,
// }: {
//   name: string;
//   size?: "sm" | "md" | "lg";
//   isOnline?: boolean;
// }) => {
//   const sizeClasses = {
//     sm: "h-8 w-8 text-xs",
//     md: "h-10 w-10 text-sm",
//     lg: "h-12 w-12 text-base",
//   };

//   return (
//     <div className="relative">
//       <div
//         className={`${sizeClasses[size]} rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold`}
//       >
//         {name}
//       </div>
//       {isOnline && (
//         <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
//       )}
//     </div>
//   );
// };

// // Badge Component
// const Badge = ({ count }: { count: number }) => {
//   if (count === 0) return null;
//   return (
//     <div className="bg-green-500 text-white text-xs font-semibold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
//       {count > 99 ? "99+" : count}
//     </div>
//   );
// };

// // Chat List Item Component
// const ChatListItem = ({
//   chat,
//   isActive,
//   onClick,
// }: {
//   chat: Chat;
//   isActive: boolean;
//   onClick: () => void;
// }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       whileTap={{ scale: 0.98 }}
//       onClick={onClick}
//       className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
//         isActive ? "bg-accent" : "hover:bg-accent/50"
//       }`}
//     >
//       <Avatar name={chat.avatar} isOnline={chat.isOnline} />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center justify-between gap-2">
//           <h3 className="font-semibold text-sm truncate text-foreground">
//             {chat.name}
//           </h3>
//           <span className="text-xs text-muted-foreground whitespace-nowrap">
//             {chat.lastMessageTime}
//           </span>
//         </div>
//         <div className="flex items-center justify-between gap-2">
//           <p className="text-sm text-muted-foreground truncate">
//             {chat.lastMessage}
//           </p>
//           <Badge count={chat.unread} />
//         </div>
//       </div>
//       {chat.isPinned && <Pin className="h-4 w-4 text-muted-foreground" />}
//     </motion.div>
//   );
// };

// // Message Bubble Component
// const MessageBubble = ({
//   message,
//   isMe,
// }: {
//   message: Message;
//   isMe: boolean;
// }) => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}
//     >
//       <div
//         className={`max-w-[70%] rounded-lg px-3 py-2 ${
//           isMe
//             ? "bg-primary text-primary-foreground"
//             : "bg-muted text-foreground"
//         }`}
//       >
//         {!isMe && message.from !== "me" && (
//           <p className="text-xs font-semibold mb-1 text-green-500">
//             {message.from}
//           </p>
//         )}
//         <p className="text-sm break-words">{message.content}</p>
//         <div className="flex items-center justify-end gap-1 mt-1">
//           <span
//             className={`text-xs ${
//               isMe ? "text-primary-foreground/70" : "text-muted-foreground"
//             }`}
//           >
//             {message.time}
//           </span>
//           {isMe &&
//             (message.seen ? (
//               <CheckCheck
//                 className={`h-3 w-3 ${
//                   isMe ? "text-primary-foreground/70" : "text-muted-foreground"
//                 }`}
//               />
//             ) : (
//               <Check
//                 className={`h-3 w-3 ${
//                   isMe ? "text-primary-foreground/70" : "text-muted-foreground"
//                 }`}
//               />
//             ))}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Typing Indicator
// const TypingIndicator = () => {
//   return (
//     <div className="flex items-center gap-2 p-3 bg-muted rounded-lg max-w-20">
//       <motion.div
//         animate={{ scale: [1, 1.2, 1] }}
//         transition={{ repeat: Infinity, duration: 1, delay: 0 }}
//         className="h-2 w-2 rounded-full bg-muted-foreground"
//       />
//       <motion.div
//         animate={{ scale: [1, 1.2, 1] }}
//         transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
//         className="h-2 w-2 rounded-full bg-muted-foreground"
//       />
//       <motion.div
//         animate={{ scale: [1, 1.2, 1] }}
//         transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
//         className="h-2 w-2 rounded-full bg-muted-foreground"
//       />
//     </div>
//   );
// };

// // Main Chat Component
// const WhatsAppChat = () => {
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(dummyChats[0]);
//   const [message, setMessage] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const [theme, setTheme] = useState<"light" | "dark">("light");
//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [selectedChat?.messages]);

//   const filteredChats = dummyChats.filter((chat) =>
//     chat.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const pinnedChats = filteredChats.filter((chat) => chat.isPinned);
//   const regularChats = filteredChats.filter((chat) => !chat.isPinned);

//   const handleSendMessage = () => {
//     if (message.trim() && selectedChat) {
//       console.log("Sending:", message);
//       setMessage("");
//     }
//   };

//   const toggleTheme = () => {
//     setTheme((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
//       <div className="flex w-full h-full bg-background text-foreground">
//         {/* Sidebar - Desktop */}
//         <div className="hidden md:flex md:w-96 border-r border-border flex-col">
//           {/* Sidebar Header */}
//           <div className="p-4 border-b border-border bg-muted/30">
//             <div className="flex items-center justify-between mb-4">
//               <h1 className="text-xl font-bold">Chats</h1>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={toggleTheme}
//                   className="p-2 rounded-full hover:bg-accent transition-colors"
//                 >
//                   {theme === "light" ? (
//                     <Moon className="h-5 w-5" />
//                   ) : (
//                     <Sun className="h-5 w-5" />
//                   )}
//                 </button>
//                 <button className="p-2 rounded-full hover:bg-accent transition-colors">
//                   <MoreVertical className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search chats..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
//               />
//             </div>
//           </div>

//           {/* Chat List */}
//           <div className="flex-1 overflow-y-auto">
//             {pinnedChats.length > 0 && (
//               <div>
//                 <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
//                   PINNED
//                 </div>
//                 {pinnedChats.map((chat) => (
//                   <ChatListItem
//                     key={chat.id}
//                     chat={chat}
//                     isActive={selectedChat?.id === chat.id}
//                     onClick={() => setSelectedChat(chat)}
//                   />
//                 ))}
//               </div>
//             )}
//             {regularChats.length > 0 && (
//               <div>
//                 {pinnedChats.length > 0 && (
//                   <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
//                     ALL CHATS
//                   </div>
//                 )}
//                 {regularChats.map((chat) => (
//                   <ChatListItem
//                     key={chat.id}
//                     chat={chat}
//                     isActive={selectedChat?.id === chat.id}
//                     onClick={() => setSelectedChat(chat)}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Sidebar */}
//         <AnimatePresence>
//           {isMobileSidebarOpen && (
//             <motion.div
//               initial={{ x: "-100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "-100%" }}
//               transition={{ type: "spring", damping: 20 }}
//               className="fixed inset-0 z-50 md:hidden bg-background"
//             >
//               <div className="flex flex-col h-full">
//                 <div className="p-4 border-b border-border bg-muted/30">
//                   <div className="flex items-center justify-between mb-4">
//                     <h1 className="text-xl font-bold">Chats</h1>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={toggleTheme}
//                         className="p-2 rounded-full hover:bg-accent transition-colors"
//                       >
//                         {theme === "light" ? (
//                           <Moon className="h-5 w-5" />
//                         ) : (
//                           <Sun className="h-5 w-5" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setIsMobileSidebarOpen(false)}
//                         className="p-2 rounded-full hover:bg-accent transition-colors"
//                       >
//                         <X className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <input
//                       type="text"
//                       placeholder="Search chats..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
//                     />
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-y-auto">
//                   {pinnedChats.map((chat) => (
//                     <ChatListItem
//                       key={chat.id}
//                       chat={chat}
//                       isActive={selectedChat?.id === chat.id}
//                       onClick={() => {
//                         setSelectedChat(chat);
//                         setIsMobileSidebarOpen(false);
//                       }}
//                     />
//                   ))}
//                   {regularChats.map((chat) => (
//                     <ChatListItem
//                       key={chat.id}
//                       chat={chat}
//                       isActive={selectedChat?.id === chat.id}
//                       onClick={() => {
//                         setSelectedChat(chat);
//                         setIsMobileSidebarOpen(false);
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Chat Window */}
//         <div className="flex-1 flex flex-col">
//           {selectedChat ? (
//             <>
//               {/* Chat Header */}
//               <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3">
//                 <button
//                   onClick={() => setIsMobileSidebarOpen(true)}
//                   className="md:hidden p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
//                 >
//                   <Menu className="h-5 w-5" />
//                 </button>
//                 <Avatar
//                   name={selectedChat.avatar}
//                   isOnline={selectedChat.isOnline}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <h2 className="font-semibold text-sm truncate">
//                     {selectedChat.name}
//                   </h2>
//                   <p className="text-xs text-muted-foreground">
//                     {selectedChat.isOnline ? "Online" : "Last seen recently"}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 rounded-full hover:bg-accent transition-colors">
//                     <Phone className="h-5 w-5" />
//                   </button>
//                   <button className="p-2 rounded-full hover:bg-accent transition-colors">
//                     <Video className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => setShowGroupInfo(!showGroupInfo)}
//                     className="p-2 rounded-full hover:bg-accent transition-colors"
//                   >
//                     <MoreVertical className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Messages Area */}
//               <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
//                 {selectedChat.messages.map((msg) => (
//                   <MessageBubble
//                     key={msg.id}
//                     message={msg}
//                     isMe={msg.from === "me"}
//                   />
//                 ))}
//                 {isTyping && <TypingIndicator />}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Message Input */}
//               <div className="p-4 border-t border-border bg-background">
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 rounded-full hover:bg-accent transition-colors">
//                     <Smile className="h-5 w-5 text-muted-foreground" />
//                   </button>
//                   <button className="p-2 rounded-full hover:bg-accent transition-colors">
//                     <Paperclip className="h-5 w-5 text-muted-foreground" />
//                   </button>
//                   <input
//                     type="text"
//                     placeholder="Type a message..."
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                     className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-2 focus:ring-ring text-sm"
//                   />
//                   <button
//                     onClick={handleSendMessage}
//                     disabled={!message.trim()}
//                     className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Send className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center bg-muted/10">
//               <div className="text-center">
//                 <div className="mb-4 text-6xl">💬</div>
//                 <h2 className="text-xl font-semibold mb-2">Select a chat</h2>
//                 <p className="text-muted-foreground">
//                   Choose a conversation to start messaging
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Group Info Panel */}
//         <AnimatePresence>
//           {showGroupInfo && selectedChat?.type === "group" && (
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 20 }}
//               className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-40 overflow-y-auto"
//             >
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-lg font-semibold">Group Info</h2>
//                   <button
//                     onClick={() => setShowGroupInfo(false)}
//                     className="p-2 rounded-full hover:bg-accent transition-colors"
//                   >
//                     <X className="h-5 w-5" />
//                   </button>
//                 </div>

//                 <div className="text-center mb-6">
//                   <Avatar name={selectedChat.avatar} size="lg" />
//                   <h3 className="mt-3 font-semibold">{selectedChat.name}</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Group · {selectedChat.participants?.length} participants
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
//                       {selectedChat.participants?.length} Participants
//                     </h4>
//                     {selectedChat.participants?.map((participant, idx) => (
//                       <div
//                         key={idx}
//                         className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
//                       >
//                         <Avatar
//                           name={participant.slice(0, 2).toUpperCase()}
//                           size="sm"
//                         />
//                         <span className="text-sm">{participant}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-sm">
//                     <UserPlus className="h-5 w-5" />
//                     Add participant
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default WhatsAppChat;

import React from "react";

const Test2 = () => {
  return <div>Test2</div>;
};

export default Test2;
