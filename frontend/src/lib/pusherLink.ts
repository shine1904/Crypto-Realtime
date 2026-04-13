import { ApolloLink, Observable, FetchResult, Operation } from "@apollo/client";
import Pusher from "pusher-js";

interface PusherLinkOptions {
    pusher: Pusher;
}

export class PusherLink extends ApolloLink {
    private pusher: Pusher;

    constructor(options: PusherLinkOptions) {
        super();
        this.pusher = options.pusher;
    }

    public request(operation: Operation, forward: any): Observable<FetchResult> {
        return new Observable((observer) => {
            // Thực thi forward (truy vấn HTTP ban đầu để đăng ký subscription)
            const subscription = forward(operation).subscribe({
                next: (data: any) => {
                    // Kiểm tra xem phản hồi có chứa channel Pusher từ Lighthouse không
                    // extensions.lighthouse_subscriptions.channels = {"SubscriptionName": "private-lighthouse-xxxx"}
                    const opName = operation.operationName ?? '';
                    const channelName =
                        data?.extensions?.lighthouse_subscriptions?.channels?.[opName];

                    if (channelName) {
                        this.subscribeToChannel(channelName, observer);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                },
                error: (err: any) => observer.error(err),
                complete: () => {
                    // Nếu không phải là subscription thì complete ngay
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        });
    }

    private subscribeToChannel(channelName: string, observer: any) {
        const channel = this.pusher.subscribe(channelName);
        
        channel.bind("lighthouse-subscription", (payload: any) => {
            if (!payload.more) {
                this.pusher.unsubscribe(channelName);
                observer.complete();
            }
            if (payload.result) {
                observer.next(payload.result);
            }
        });

        // Bắt lỗi pusher auth nếu có
        channel.bind("pusher:subscription_error", (error: any) => {
            console.error("Subscription error", error);
            observer.error(error);
        });
    }
}
