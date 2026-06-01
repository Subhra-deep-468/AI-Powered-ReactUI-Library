import Component from "../models/components.model.js"
import User from "../models/user.model.js"
import path from "path"
import fs from "fs"
import exesync from "child_process"

export const saveComponent = async (req, res) => {
    try {
        const { name, code, props } = req.body
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.role == "admin") {
            const existing = await Component.findOne({ name, visibility: "public" })
            if (existing) {
                return res.status(400).json({
                    message: "admin cannot create duplicate public component name",
                })
            }
        }
        if (user.role !== "admin") {
            const existing = await Component.findOne({ name, owner: req.userId })
            if (existing) {
                return res.status(400).json({
                    message: "you cannot create duplicate component name",
                })
            }
        }
        const component = await Component.create({
            name,
            code,
            props,
            owner: req.userId,
        })
        res.status(200).json(component)
    } catch (error) {
        res.status(500).json({ message: `Error saving component: ${error.message}` })
    }
}

export const publishComponent = async (req, res) => {
    try {
        const { componentId } = req.body

        const component = await Component.findById(componentId)
        if (!component) {
            return res.status(404).json({ message: "Component not found" })
        }
        if (component.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only publish your own components" })
        }

        const libPath = path.join(process.cwd(), "../virtual-ui-lib")
        const componentDir = path.join(libPath, "src/components", component.name)
        const componentFile = path.join(componentDir, `${component.name}.jsx`)
        const indexFilePath = path.join(libPath, "src/index.js")

        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true })
        }

        fs.writeFileSync(componentFile, component.code)

        let indexContent = fs.readFileSync(indexFilePath, "utf-8")
        const exportLine = `export { default as ${component.name} } from "./components/${component.name}/${component.name}.jsx";\n`
        if (!indexContent.includes(exportLine)) {
            fs.appendFileSync(indexFilePath, exportLine)
        }

        console.log("cleaning old builds...")
        const distPath = path.join(libPath, "dist")
        if (fs.existsSync(distPath)) {
            fs.rmSync(distPath, { recursive: true, force: true })
        }

        console.log("rebuilding the library...")
        exesync.execSync("npm run build", { cwd: libPath, stdio: "inherit" })

        console.log("updating version...")
        exesync.execSync("npm version patch", { cwd: libPath, stdio: "inherit" })

        console.log("publishing to npm...")
        exesync.execSync("npm publish", { cwd: libPath, stdio: "inherit" })

        component.visibility = "public"
        component.npmPackage = "virtual-ui-component-lib-subhradeep"
        await component.save()

        res.status(200).json({ message: "Component published successfully" })
    } catch (error) {
        res.status(500).json({ message: `Error publishing component: ${error.message}` })
    }
}



