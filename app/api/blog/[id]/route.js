 import { connectToDB } from "@utils/database";
import Blog from "@models/blog";
import { verifyJwtToken,accessToken} from "@utils/verifyToken";




export async function GET(req,ctx){
    const id = ctx.params.id
    try {
        await connectToDB()
        const blog=await Blog.findById({id}).populate("authorId").select("-password")
        new Response(JSON.stringify(blog),{status:200})
    } catch (error) {
        new Response(JSON.stringify(null),{status:500})
        
    }




}

 
export async function PUT(req, ctx) {
    await connectToDB()

    const id = ctx.params.id
    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(" ")[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const body = await req.json()
        const blog = await Blog.findById(id).populate('authorId')

        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return new Response(JSON.stringify({ msg: 'Only author can update his blog' }), { status: 403 })
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: { ...body } }, { new: true })

        return new Response(JSON.stringify(updatedBlog), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 })
    }
}

export async function DELETE(req, ctx) {
    await connectToDB()

    const id = ctx.params.id

    const accessToken = req.headers.get('authorization')
    const token = accessToken.split(' ')[1]

    const decodedToken = verifyJwtToken(token)

    if (!accessToken || !decodedToken) {
        return new Response(JSON.stringify({ error: "unauthorized (wrong or expired token)" }), { status: 403 })
    }

    try {
        const blog = await Blog.findById(id).populate('authorId')
        if (blog?.authorId?._id.toString() !== decodedToken._id.toString()) {
            return new Response(JSON.stringify({ msg: 'Only author can delete his blog' }), { status: 403 })
        }

        await Blog.findByIdAndDelete(id)

        return new Response(JSON.stringify({msg: 'Successfully deleted blog'}), {status: 200})
    } catch (error) {
        return new Response(JSON.stringify(null), { status: 500 }) 
    }
}