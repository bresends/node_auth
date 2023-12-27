import { useQuery, useQueryClient } from '@tanstack/react-query';

export function Root() {
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ['user'], queryFn: getTodos });
    return (
        <main className="flex justify-center items-center h-[100dvh]">
            Tasks
        </main>
    );
}
