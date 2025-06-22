import { ProjectInterface } from "@/common.types";
import Categories from "@/components/Categories";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/graphql";

type SearchParams = {
  category?: string | null;
  endCursor?: string | null;
}

type Props = {
  searchParams: SearchParams
}

type ProjectSearch = {
  projectSearch: {
    edges: { node: ProjectInterface }[];
    pageInfo: {
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  },
}

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

const Home = async ({ searchParams: { category, endCursor } }: Props) => {
  const data = await getProjects(category, endCursor);

  const projectsToDisplay = data?.projectSearch?.edges?.map((edge: any) => edge.node) || [];

  if (projectsToDisplay.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <Categories />
        <p className="no-result-text text-center">No projects found, go create some first.</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <Categories />
      <section className="projects-grid">
        {projectsToDisplay.map((project: ProjectInterface) => (
          <ProjectCard
            key={`${project?.id}`}
            project={project}
          />
        ))}
      </section>
      {data?.projectSearch?.pageInfo?.hasNextPage && (
        <LoadMore 
          startCursor={data?.projectSearch?.pageInfo?.startCursor} 
          endCursor={data?.projectSearch?.pageInfo?.endCursor}
          hasPreviousPage={data?.projectSearch?.pageInfo?.hasPreviousPage} 
          hasNextPage={data?.projectSearch?.pageInfo?.hasNextPage}
        />
      )}
    </section>
  );
};

export default Home;