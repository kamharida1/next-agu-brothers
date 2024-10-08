// this is a client component, because we need to use client-side feature
'use client'

import { deletePost } from "@/lib/services/blogServerActions"

// Define the props that the PostDelete component expects.
interface PostDeleteProps {
  slug: string | undefined // The ID of the post to delete.
}


export default function PostDelete({ slug }: PostDeleteProps) {
  // Define the action to perform when the form is submitted.
  // This is how we do it if we omit the bind from the server action
  const deleteAction: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault() // Prevent the form from being submitted in the traditional way.
    deletePost(slug as string) // Delete the post with the given ID.
  }

  // Render a form with a single submit button. When the button is clicked, the form is submitted
  // and the deleteAction is performed.
  return (
    <form onSubmit={deleteAction}>
      <button type="submit" className="btn btn-outline btn-error btn-sm">
        Delete
      </button>
    </form>
  )
}
