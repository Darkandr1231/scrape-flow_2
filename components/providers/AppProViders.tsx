"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import NextTopLoader from "nextjs-toploader";

export function AppProviders({children}:{children: React.ReactNode}){
    const [mounted, setMounted] = useState(false);
    const [queryClient] = useState(() => new QueryClient())

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
      <QueryClientProvider client={queryClient}>
        <NextTopLoader color="#10b981" showSpinner={false} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    );
}