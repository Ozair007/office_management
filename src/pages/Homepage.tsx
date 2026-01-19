import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Homepage() {
	const { user, signOut } = useAuth();

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl">Hello {user?.firstName}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-4">
					<p className="text-muted-foreground">Welcome to the platform!</p>
					<Button variant="outline" onClick={signOut}>
						Sign out
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export default Homepage;
