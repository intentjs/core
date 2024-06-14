export class ConnectionNotFound extends Error {
  constructor(conName: string) {
    super(
      `${conName} not found! Please make sure you are passing correct connection name! Or alternatively, check if you have initialised ObjectionModule`,
    );
  }
}
