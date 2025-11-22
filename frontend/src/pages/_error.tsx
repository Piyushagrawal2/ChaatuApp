import { Button } from '@/components/ui/button';

function Error({ statusCode }: { statusCode: number }) {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-6xl font-bold text-destructive">
                {statusCode ? statusCode : 'Error'}
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
                {statusCode
                    ? `An error ${statusCode} occurred on server`
                    : 'An error occurred on client'}
            </p>
            <Button className="mt-8" onClick={() => window.location.reload()}>
                Try Again
            </Button>
        </div>
    );
}

Error.getInitialProps = ({ res, err }: any) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
