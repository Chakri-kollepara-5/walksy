import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import { completeTask } from "@/services/taskService";
import TaskSuccess from "./TaskSuccess";

const CompleteTaskModal = ({ task, onSuccess }) => {
    const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            toast.error("Please enter a valid 4-digit numeric OTP.");
            return;
        }

        setLoading(true);
        try {
            await completeTask(task.id, otp);
            setIsSuccess(true);
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.message || "Failed to complete task");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setIsSuccess(false);
        setOtp("");
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg shadow-green-200 mt-4 rounded-xl py-6"
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Complete Delivery
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                {isSuccess ? (
                    <TaskSuccess task={task} onClose={handleClose} />
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Complete Delivery & Claim Reward</DialogTitle>
                            <DialogDescription>
                                Enter the 4-digit OTP provided by the requester after you have finished the task. This will verify completion and transfer the payment to your wallet.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-center block text-lg font-medium">Enter 4-Digit OTP</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    placeholder="0-0-0-0"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="text-center text-3xl tracking-[1em] font-mono h-16"
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Complete"}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CompleteTaskModal;
