## 開啟聊天室步驟
1. npm run build  
(如果下 npm run build 可能會報這樣的錯  
    ['error:03000086:digital envelope routines::initialization error' ] ....   
    所以 可以試看看 這個指令 ：   
     export NODE_OPTIONS=--openssl-legacy-provider     
    然後再下 Step2
    參考網址：https://stackoverflow.com/questions/74726224/opensslerrorstack-error03000086digital-envelope-routinesinitialization-ehttps://stackoverflow.com/questions/74726224/opensslerrorstack-error03000086digital-envelope-routinesinitialization-e
) 
2. npm run dev 
3. localhost:3008/main (預設port:3008) 
4. 成功開啟聊天室！