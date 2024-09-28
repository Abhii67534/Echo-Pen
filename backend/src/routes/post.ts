import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
        HONO_R2_UPLOAD: R2Bucket;
    },
    Variables: {
        userId?: string
    }
}

>()



postRouter.use("/*", async (c, next) => {
    console.log(c.env.JWT_SECRET);
    const authHeader = c.req.header("Authorization");
    console.log("TOKENNN", authHeader);

    if (!authHeader) {
        return c.json({ error: "Authorization header is missing" }, 401);
    }


    const decoded = await verify(authHeader, c.env.JWT_SECRET);
    console.log("DECODDEDDDD", decoded.id);
    console.log('HELLLLOOOO');
    
    


    if (!decoded.id) {
        return c.json({ msg: "Issue in decoding token" }, 403);
    }


    c.set('userId', decoded.id as string);
    await next();
});


postRouter.post('/blog', async (c) => {

    const userid = c.get('userId');
    console.log('USER ID  ',userid);
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    
    // Parse the form data instead of JSON
    const formData = await c.req.formData();
    const title = formData.get('title');
    const content = formData.get('content');
    const file = formData.get('avatar'); // Get the file from formData

    console.log('Uploaded file:', file);
    console.log('Title:', title);
    console.log('Content:', content);

    // Input validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return c.json({ error: "Title is required." }, 400);
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return c.json({ error: "Content is required." }, 400);
    }

    let avatarUrl =
        "https://blog.snappymob.com/wp-content/uploads/2020/12/8-Tips-for-Designing-Empty-Placeholder-Pages-Leni-Featured.png"; // Default avatar URL

    // Handle file upload if a file is provided
    if (file) {
        // Check if the file is of type File
        if (file instanceof File) {
            console.log("Uploading file...");
            try {
                await c.env.HONO_R2_UPLOAD.put(file.name, file); // Ensure file is being uploaded correctly
                console.log("File upload completed.");
                avatarUrl = `https://echo-pen.org/${file.name}`; // Update avatarUrl to uploaded file URL
            } catch (uploadError) {
                console.error("Error uploading file:", uploadError);
                return c.json({ error: "Error uploading file." }, 500);
            }
        } else {
            console.error("Uploaded file is not a valid File object.");
        }
    }

    // Create the blog post
    try {
        const blog = await prisma.post.create({
            data: {
                title: title as string,
                content: content as string,
                authorId: String(userid),
                avatar: avatarUrl,
            }
        });

        console.log("BLOG CREATED", blog);
        return c.json({ msg: "Blog created successfully", id: blog.id }, 200);
    } catch (error) {
        console.error("Error creating blog post:", error);
        return c.json({ error: "Error creating blog post.", details: error instanceof Error ? error.message : "Unknown error occurred." }, 500);
    }
});



// postRouter.put('/blog', async (c) => {
//     const prisma = new PrismaClient({
//         datasourceUrl: c.env.DATABASE_URL,
//     }).$extends(withAccelerate())

//     const body = await c.req.json();

//     const blog = await prisma.post.update({
//         where: {
//             id: body.id

//         },
//         data: {
//             title: body.title,
//             content: body.content,


//         }
//     });

//     if (!blog) {
//         return c.json({ error: "An error occoured" })
//     }


//     return c.json('updated')
// })

postRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const allBlogs = await prisma.post.findMany({
        include: {
            author: {
                select: {
                    name: true,
                    avatar: true,
                },
            },
        },
    });

    console.log(allBlogs); // This will include the likes count automatically
    return c.json(allBlogs); // No need to map the likes again
});



postRouter.post('/blog/:id/like', async (c) => {
    const postId = c.req.param('id'); // Get post ID from the URL
    console.log("IDDDDD ",postId);
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        // Increment the likes by 1 for the specified post
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: {
                likes: {
                    increment: 1,
                },
            },
        });
        console.log(updatedPost);
        
        return c.json(updatedPost); // Return the updated post
    } catch (error) {
        console.error("Error liking post:", error);
        return c.json({ error: "An error occurred while liking the post." }, 500);
    }
});

