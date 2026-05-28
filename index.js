const http = require('http');
const path = require('path');
const fs = require('fs')
const ejs = require('ejs')

const PORT = 5000

function homeEjs(req, res, value) {
    const filePath = path.join(__dirname, "views", "home.ejs");


    fs.readFile(filePath, 'utf8', (err, template) => {
        if (err) {
            res.writeHead(404)
            return res.end("Page Not Found")
        }
        const html = ejs.render(template, value)
        res.writeHead(200, {
            "content-type": "text/html"
        })
        res.end(html)
    })
}
const getHomeRouter = async (req, res) => {
    homeEjs(req, res, {
        err: null,
        msg: null
    });
};

const existingWord = async (fileName, englishWord) => {

    return new Promise((resolve) => {


        if (!fs.existsSync(fileName)) {
            fs.writeFileSync(fileName, "")
        }


        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) {
                throw new Error("Server Error");
            }
            const lines = data.split("\n")
            for (let i = 0; i < lines.length; i++) {
                const [En, Bn] = lines[i].split(":")
                if (En && En.toLowerCase() === englishWord.toLowerCase()) {
                    return resolve(true)
                }
            }
            return resolve(false)
        })
    })
}

const postHomeRouter = async (req, res) => {
    let body = "";
    req.on("data", (chunk) => {
        body += chunk;
    })

    req.on("end", async () => {
        const param = new URLSearchParams(body)
        const englishWord = param.get("englishWord").trim()
        const banglaWord = param.get("banglaWord").trim()
        if (!englishWord || !banglaWord) {
            return homeEjs(req, res, {
                err: "All fields required",
                msg: null
            });
        }
        const dir = path.join(__dirname, "Words");
        const fileName = path.join(dir, englishWord[0].toUpperCase() + "-Words.txt").trim()
        fs.mkdirSync(dir, { recursive: true })

        const parmission = await existingWord(fileName, englishWord)

        if (parmission) {
            return homeEjs(req, res, {
                err: "Word already exists",
                msg: null
            });
        }

        fs.appendFile(fileName, `${englishWord}:${banglaWord}\n`, (err) => {
            if (err) {
                throw new Error("Server Error")
            }
            homeEjs(req, res, {
                err: null,
                msg: "Word Uploaded"
            });
        })

    })
}

const Server = http.createServer(async (req, res) => {


    if (req.method === "GET" && req.url === "/") {
        try {

            await getHomeRouter(req, res);
        } catch (error) {
            return (
                res.writeHead(500),
                res.end("Server Error")
            )
        }
    } else if (req.method === "POST" && req.url === "/") {
        try {
            await postHomeRouter(req, res)

        } catch (error) {
            return (
                res.writeHead(500),
                res.end("Server Error")
            )
        }
    } else {
        return (
            res.writeHead(500),
            res.end("Server Error")
        )
    }


})

Server.listen(PORT, console.log(`Server running at http://127.0.0.1:${PORT}/`));


