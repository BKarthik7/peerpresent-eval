import React, { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	ScreenShare,
	ScreenShareOff,
	Play,
	Pause,
	Video,
	VideoOff,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ExtendedMediaTrackConstraints extends MediaTrackConstraints {
	cursor?: string;
}

export const PresentationControls: React.FC = () => {
	const room = useRoom();
	const {
		teams,
		currentPresenter,
		isPresentationActive,
		isScreenSharing,
		screenShareStream, // Use this from the context directly
		startPresentation,
		stopPresentation,
		startScreenShare,
		stopScreenShare,
	} = room;
	const [selectedTeam, setSelectedTeam] = useState<string>(
		currentPresenter?.name || ""
	);
	const [showScreenSharePrompt, setShowScreenSharePrompt] = useState(false);
	const { toast } = useToast();

	const handleStartPresentation = () => {
		const team = teams.find((t) => t.name === selectedTeam);
		if (!team) {
			toast({
				title: "Error",
				description: "Please select a team first",
				variant: "destructive",
			});
			return;
		}

		startPresentation(team);
		toast({
			title: "Presentation Started",
			description: `${team.name} is now presenting`,
		});
	};

	const handleStopPresentation = () => {
		stopPresentation();
		toast({
			title: "Presentation Stopped",
			description: "The presentation has been ended",
		});
	};

	const handleScreenSharePrompt = () => {
		setShowScreenSharePrompt(true);
	};

	const handleStartScreenShare = async () => {
		try {
			setShowScreenSharePrompt(false);
			console.log("Attempting to get display media...");

			const constraints: ExtendedMediaTrackConstraints = {
				cursor: "always",
			};

			// Use displayMedia API with correct TypeScript constraints
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: constraints,
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
				},
			});

			console.log("Display media acquired:", stream);
			startScreenShare(stream);

			toast({
				title: "Screen Sharing Started",
				description: "Your screen is now visible to all peers",
			});
		} catch (error) {
			console.error("Error starting screen share:", error);
			toast({
				title: "Screen Sharing Failed",
				description:
					"Could not start screen sharing. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleStopScreenShare = () => {
		stopScreenShare();
		toast({
			title: "Screen Sharing Stopped",
			description: "Your screen is no longer shared",
		});
	};

	return (
		<div className="space-y-6">
			<Card className="glass-morphism">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Video className="h-5 w-5" />
						Presentation Controls
					</CardTitle>
					<CardDescription>
						Start or stop presentations and control which team is
						presenting
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{teams.length === 0 ? (
						<Alert>
							<AlertTitle>No teams available</AlertTitle>
							<AlertDescription>
								Create teams first before starting a
								presentation
							</AlertDescription>
						</Alert>
					) : (
						<>
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Select Presenting Team
								</label>
								<Select
									value={selectedTeam}
									onValueChange={setSelectedTeam}
									disabled={isPresentationActive}
								>
									<SelectTrigger>
										<SelectValue placeholder="Choose a team" />
									</SelectTrigger>
									<SelectContent>
										{teams.map((team, index) => (
											<SelectItem
												key={index}
												value={team.name}
											>
												{team.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
								{!isPresentationActive ? (
									<Button
										onClick={handleStartPresentation}
										className="flex items-center gap-2"
										disabled={!selectedTeam}
									>
										<Play className="h-4 w-4" />
										Start Presentation
									</Button>
								) : (
									<Button
										onClick={handleStopPresentation}
										variant="destructive"
										className="flex items-center gap-2"
									>
										<Pause className="h-4 w-4" />
										Stop Presentation
									</Button>
								)}

								{isPresentationActive && !isScreenSharing ? (
									<Button
										onClick={handleScreenSharePrompt}
										variant="secondary"
										className="flex items-center gap-2"
									>
										<ScreenShare className="h-4 w-4" />
										Share Screen
									</Button>
								) : isPresentationActive && isScreenSharing ? (
									<Button
										onClick={handleStopScreenShare}
										variant="outline"
										className="flex items-center gap-2"
									>
										<ScreenShareOff className="h-4 w-4" />
										Stop Sharing
									</Button>
								) : null}
							</div>

							{isPresentationActive && currentPresenter && (
								<Alert className="bg-green-500/10 text-green-500 border-green-500/50">
									<AlertTitle className="text-green-500">
										Active Presentation
									</AlertTitle>
									<AlertDescription className="text-green-500/90">
										{currentPresenter.name} is currently
										presenting. All peers can see this
										presentation.
										{isScreenSharing &&
											" Your screen is currently being shared."}
									</AlertDescription>
								</Alert>
							)}

							{isPresentationActive && (
								<>
									<Separator />

									<div className="bg-secondary/20 rounded-lg p-4">
										<h3 className="text-lg font-medium mb-2">
											Live Screen Preview
										</h3>
										{isScreenSharing ? (
											<div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
												<video
													autoPlay
													playsInline
													ref={(videoElement) => {
														if (
															videoElement &&
															isScreenSharing
														) {
															videoElement.srcObject =
																null;
															// Use screenShareStream from the context we already have
															videoElement.srcObject =
																screenShareStream;
															videoElement
																.play()
																.catch((e) =>
																	console.error(
																		"Error playing video:",
																		e
																	)
																);
														}
													}}
													className="w-full h-full object-contain"
												/>
											</div>
										) : (
											<div className="w-full aspect-video bg-secondary/30 rounded-lg flex flex-col items-center justify-center p-8">
												<ScreenShare className="h-16 w-16 text-secondary-foreground/30 mb-4" />
												<p className="text-center text-secondary-foreground/70">
													No screen is being shared
												</p>
												<p className="text-sm text-muted-foreground mt-2 text-center">
													Click "Share Screen" to
													start sharing your screen
													with peers
												</p>
											</div>
										)}
									</div>
								</>
							)}

							<div className="border-t border-border pt-4">
								<h4 className="text-sm font-medium mb-2">
									Screen Sharing Instructions
								</h4>
								<p className="text-sm text-muted-foreground mb-2">
									Once you start the presentation:
								</p>
								<ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1">
									<li>
										Peers will be notified that a
										presentation has started
									</li>
									<li>
										Click "Share Screen" to share your
										screen with all peers
									</li>
									<li>
										Choose which screen or application
										window to share
									</li>
									<li>
										When finished, click "Stop Sharing" to
										end screen sharing
									</li>
									<li>
										Click "Stop Presentation" when the
										entire presentation is complete
									</li>
								</ol>
							</div>

							{/* Screen Share Confirmation Dialog */}
							<Dialog
								open={showScreenSharePrompt}
								onOpenChange={setShowScreenSharePrompt}
							>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>
											Share your screen
										</DialogTitle>
										<DialogDescription>
											You'll be prompted to select which
											screen or application window to
											share with peers.
										</DialogDescription>
									</DialogHeader>
									<div className="flex flex-col space-y-4 pt-4">
										<p className="text-sm text-muted-foreground">
											When you click "Start Sharing", your
											browser will ask for permission to
											share your screen. Select the window
											or screen you want to share and
											confirm.
										</p>
										<div className="flex justify-end space-x-2">
											<Button
												variant="outline"
												onClick={() =>
													setShowScreenSharePrompt(
														false
													)
												}
											>
												Cancel
											</Button>
											<Button
												onClick={handleStartScreenShare}
											>
												<ScreenShare className="h-4 w-4 mr-2" />
												Start Sharing
											</Button>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
