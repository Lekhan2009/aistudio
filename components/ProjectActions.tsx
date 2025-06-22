
"use client";

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { deleteProject, fetchToken } from '@/lib/actions'

type Props = {
    projectId: string
}

const ProjectActions = ({ projectId }: Props) => {
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const router = useRouter()
    
    const handleDeleteProject = async () => {
        setIsDeleting(true)
        
        const { token } = await fetchToken();

        try {
            await deleteProject(projectId, token);
            
            router.push("/");
        } catch (error) {
            console.error(error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="flexCenter gap-4 text-sm font-medium">
                <Link href={`/edit-project/${projectId}`} className="flexCenter edit-action_btn">
                    <Image src="/pencile.svg" width={15} height={15} alt="edit" />
                </Link>

                <button
                    type="button"
                    disabled={isDeleting}
                    className={`flexCenter delete-action_btn ${
                        isDeleting ? "bg-gray" : "bg-primary-purple"
                    }`}
                    onClick={handleDeleteProject}
                >
                    <Image src="/trash.svg" width={15} height={15} alt="delete" />
                </button>
            </div>

            {isDeleting && (
                <Image 
                    src="/loader.svg"
                    width={50}
                    height={50}
                    className="object-contain"
                    alt="loading"
                />
            )}
        </>
    )
}

export default ProjectActions
