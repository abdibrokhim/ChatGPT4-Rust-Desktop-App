'use client';

// console.log(window.__TAURI_IPC__);

import { ChangeEvent, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Notes from './notes';

export default function Home() {

  type ChatItemClas = {
    content: string;
    isUser: boolean;
  };


  const [input, setInput] = useState('');
  const [chatItems, setChatItems] = useState<ChatItemClas[]>([]);
  const [loading, setLoading] = useState(false);
  // const [base64, setBase64] = useState<string | null>(null);

  function isApiKey() {
    return localStorage.getItem('openai-api-key') !== null;
  }

  const handleGenerate = (userInput: string) => {
    console.log('================= Generating completion =================');
    console.log('prompt: ', userInput);

    if (userInput) {
      setLoading(true);
      if (!isApiKey()) {
        console.log('API Key is required');
        return;
      };

      invoke<string>('get_completion', { prompt: userInput, key: localStorage.getItem('openai-api-key')?.toString() })
        .then(response => {
            console.log(response);
            let res = JSON.parse(response);
            console.log('res: ', res);
            let text = res.choices[0].message.content;
            console.log('text: ', text);
            setChatItems(prevItems => [...prevItems, { content: text, isUser: false }]);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      console.log('Prompt is required');
    }
  };

  // const handleGenerateImage = () => {
  //   console.log('================= Generating completion with image =================');
  //   console.log('prompt: ', input);
  //   console.log('image: ', base64);

  //   if (input && base64) {
  //     setLoading(true);
  //     invoke<string>('get_completion_image', { prompt: input, imageUrl: `data:image/jpeg;base64,${base64}` })
  //       .then(response => {
  //           console.log(response);
  //           let res = JSON.parse(response);
  //           console.log('res: ', res);
  //           let text = res.choices[0].message.content;
  //           console.log('text: ', text);
  //           setChatItems([...chatItems, { content: text, isUser: false }]);
  //       })
  //       .catch(console.error)
  //       .finally(() => setLoading(false));
  //   } else {
  //     console.log('Prompt and image are required');
  //   }
  // }

  // const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  //   setLoading(true);
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       const base64 = reader.result?.toString().split(',')[1];
  //       setBase64(base64!);
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //     setLoading(false);
  // };


  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!loading && input.trim() !== "") {
      const userInput = input;
      setChatItems(prevItems => [...prevItems, { content: userInput, isUser: true }]);
      setInput("");
      console.log('chatting');
      handleGenerate(userInput);
      // if (base64) {
      //   console.log('chatting with image');
      //   handleGenerateImage();
      // } else {
      //   console.log('chatting');
      //   handleGenerate();
      // }
    }
  };

  
  const ChatItem = ({ content, isUser }: ChatItemClas) => {
    return (
      <>
      <li className="flex justify-start pt-5 pb-5">
        <div
          className={`relative max-w-xl px-4 py-2 text-white rounded shadow ${
            isUser ? "" : ""
          }`} style={{ whiteSpace: 'pre-wrap' }}>
          {content}
        </div>
      </li>
      </>
    );
  };
  

  return (
    <div className="overflow-hidden w-full z-20 h-full relative">
      <div className="flex h-full flex-1 flex-col md:pl-[260px]">
        <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <div className="flex-1 overflow-auto pb-32">
            <div className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
              <ul className="space-y-2 w-full overflow-y-auto">
                {chatItems.map((item, i) => (
                  <ChatItem
                    key={i}
                    isUser={item.isUser}
                    content={item.content}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-260px)] py-2 bg-black">
            <form
              onSubmit={handleSubmit}
              className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
              {/* <label htmlFor="image-upload" className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-paperclip" viewBox="0 0 16 16">
                  <path d="M15.354 2.896c-.479-.48-1.254-.48-1.733 0L3.55 13.07c-.24.24-.363.55-.347.864.016.314.156.611.394.849.478.479 1.254.479 1.733 0L15.64 4.608c.479-.48.479-1.255 0-1.734a1.23 1.23 0 0 0-1.733 0L5.424 11.358a.617.617 0 1 1-.872-.872L13.035 2.102a.617.617 0 1 1 .873.872L5.424 11.458a1.23 1.23 0 0 0 1.734 1.734l8.165-8.166c.24-.24.363-.55.347-.864a1.23 1.23 0 0 0-.396-.85z"/>
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
              </label> */}
              <div className="flex flex-col w-full py-2 pl-3 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-dark text-dark dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <textarea
                value={input}
                tabIndex={0}
                rows={1}
                placeholder="Message ChatGPT"
                onChange={(e) => setInput(e.target.value)}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 4 * 24)}px`; // Assuming 24px per row, adjust if necessary
                }}
                className="outline-none m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
              />
                <button
                  disabled={loading || input === ""}
                  id="chat-submit"
                  type="submit"
                  className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent cursor-pointer"
                  style={{ backgroundColor: input ? 'white' : '' }}
                >
                  {loading ? (
                    <div className="spinner" role="status"></div>
                  ) : (
                    input === "" ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-lg text-white dark:text-black"><path fill="#ffffff" fillRule="evenodd" d="M12 3a1 1 0 0 1 .707.293l7 7a1 1 0 0 1-1.414 1.414L13 6.414V20a1 1 0 1 1-2 0V6.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l7-7A1 1 0 0 1 12 3" clipRule="evenodd"></path></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-lg text-black dark:text-black"><path fill="#000000" fillRule="evenodd" d="M12 3a1 1 0 0 1 .707.293l7 7a1 1 0 0 1-1.414 1.414L13 6.414V20a1 1 0 1 1-2 0V6.414l-5.293 5.293a1 1 0 0 1-1.414-1.414l7-7A1 1 0 0 1 12 3" clipRule="evenodd"></path></svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <div className="dark bg-gray-900 fixed inset-y-0 flex w-[260px] flex-col">
        <div className="flex h-full min-h-0 flex-col">
          <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2">
                <div className="sticky left-0 right-0 top-0 z-20 bg-token-sidebar-surface-primary pt-3.5 juice:static juice:pt-0">
                  <div className="pb-0.5 last:pb-0" tabIndex={0}>
                    <a className="group flex h-10 items-center gap-2 rounded-lg bg-token-sidebar-surface-primary px-2 font-medium juice:gap-2.5 juice:font-normal hover:bg-token-sidebar-surface-secondary" 
                        onClick={() => setChatItems([])}>
                      <div className="h-7 w-7 flex-shrink-0">
                        <div className="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-token-main-surface-primary text-token-text-primary">
                          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2/3 w-2/3" role="img">
                            <text x="-9999" y="-9999">ChatGPT</text>
                            <path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z" fill="currentColor"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-token-text-primary">ChatGPT</div>
                      <div className="flex gap-3 juice:gap-2">
                        <span className="flex items-center" data-state="closed">
                          <button className="text-token-text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="icon-md">
                              <path d="M15.673 3.913a3.121 3.121 0 1 1 4.414 4.414l-5.937 5.937a5 5 0 0 1-2.828 1.415l-2.18.31a1 1 0 0 1-1.132-1.13l.311-2.18A5 5 0 0 1 9.736 9.85zm3 1.414a1.12 1.12 0 0 0-1.586 0l-5.937 5.937a3 3 0 0 0-.849 1.697l-.123.86.86-.122a3 3 0 0 0 1.698-.849l5.937-5.937a1.12 1.12 0 0 0 0-1.586M11 4A1 1 0 0 1 10 5c-.998 0-1.702.008-2.253.06-.54.052-.862.141-1.109.267a3 3 0 0 0-1.311 1.311c-.134.263-.226.611-.276 1.216C5.001 8.471 5 9.264 5 10.4v3.2c0 1.137 0 1.929.051 2.546.05.605.142.953.276 1.216a3 3 0 0 0 1.311 1.311c.263.134.611.226 1.216.276.617.05 1.41.051 2.546.051h3.2c1.137 0 1.929 0 2.546-.051.605-.05.953-.142 1.216-.276a3 3 0 0 0 1.311-1.311c.126-.247.215-.569.266-1.108.053-.552.06-1.256.06-2.255a1 1 0 1 1 2 .002c0 .978-.006 1.78-.069 2.442-.064.673-.192 1.27-.475 1.827a5 5 0 0 1-2.185 2.185c-.592.302-1.232.428-1.961.487C15.6 21 14.727 21 13.643 21h-3.286c-1.084 0-1.958 0-2.666-.058-.728-.06-1.369-.185-1.96-.487a5 5 0 0 1-2.186-2.185c-.302-.592-.428-1.233-.487-1.961C3 15.6 3 14.727 3 13.643v-3.286c0-1.084 0-1.958.058-2.666.06-.729.185-1.369.487-1.961A5 5 0 0 1 5.73 3.545c.556-.284 1.154-.411 1.827-.475C8.22 3.007 9.021 3 10 3A1 1 0 0 1 11 4"></path>
                            </svg>
                          </button>
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <Notes />
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
  }
