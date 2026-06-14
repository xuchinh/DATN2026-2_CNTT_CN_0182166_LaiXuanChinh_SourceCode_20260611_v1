import { sendRequest } from "@/utils/api";

export const handleBlogs = async (searchParams: { [key: string]: any }) => {
  const current = searchParams?.current ?? 1;
  const pageSize = searchParams?.pageSize ?? 10;

  const [res, buildingRes] = await Promise.all([
    sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
      method: "GET",
      queryParams: { current, pageSize },
      nextOption: { next: { tags: ["list-blogs"] } },
    }),
    sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/buildings`,
      method: "GET",
      queryParams: { current: 1, pageSize: 9999 },
    }),
  ]);

  if (res?.data?.results) {
    const buildings: any[] = buildingRes?.data?.results ?? [];
    const buildingMap = new Map(buildings.map((b: any) => [b._id, b]));

    res.data.results = res.data.results
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .map((blog: any) => {
        const building = buildingMap.get(blog.buildingId);
        return {
          ...blog,
          buildingName: building?.name,
          buildingAddress: building?.address,
          buildingPrice: building?.priceOfRoom,
        };
      });
  }
  return res;
};


export const handleBlogsByUser = async (id: string) => {
  const current = 1;
  const pageSize = 10;

  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
    method: "GET",
    queryParams: { current, pageSize, userId: id },
    nextOption: {
      next: { tags: ["list-blogs"] },
    },
  })
  if (res?.data?.results) {
    res.data.results = res?.data?.results.sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  return res;
};

export const handleBlogsById = async (id: string) => {
  const current = 1;
  const pageSize = 10;

  // const session = await auth();
  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
    method: "GET",
    queryParams: { current, pageSize, _id: id },
    nextOption: {
      next: { tags: ["list-blogs"] },
    },
  })
  if (res?.data?.results) {
    res.data.results = res?.data?.results.sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  return res;
};


export const handleBlogsByBuilding = async (id: string) => {
  const current = 1;
  const pageSize = 10;

  const res = await sendRequest<IBackendRes<any>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blogs`,
    method: "GET",
    queryParams: { current, pageSize, buildingId: id },
    nextOption: {
      next: { tags: ["list-blogs"] },
    },
  })
  if (res?.data?.results) {
    res.data.results = res?.data?.results.sort(
      (a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
  return res;
};
