//外部模块
import app from "../service/server/index.js";
import { createServer } from "http";

//私有模块
import { fileUploadQuery, fileReadQuery } from "./myUploader.js";

console.log("server time--服务器开机");

//网络消息处理👇
app.all("/", (req, res) => res.send("hello there!"));
app.post("/rest/file/upload", fileUploadQuery);
app.get(/\/rest\/file\/read\/*\.*/, fileReadQuery);

const PORT = global.envGetter("PORT") || 3000;
const httpServer = createServer(app);
httpServer.listen(PORT, () => console.log(`http service enabled -- 服务已启用: ${PORT}`));
