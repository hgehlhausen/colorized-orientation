export class DigitalSignalProcessor {

  public static BUFFER_SIZE: number = 4096;

  private dataBuffer: number[];

  private transformation: any;

  constructor() {
    this.dataBuffer = [];
    this.transformation = (value) => value;
  }

  public setTransformation(transformationFn): DigitalSignalProcessor {
    this.transformation = transformationFn;
    return this;
  }

  public push(newValue: number): DigitalSignalProcessor {
    this.dataBuffer.push(this.transformation(newValue));
    if (this.dataBuffer.length > DigitalSignalProcessor.BUFFER_SIZE) {
      this.dataBuffer.shift();
    }
    return this;
  }

  public getProcessedValue(): number {
    let total: number = 0;

    total = this.dataBuffer.reduce((runningTotal, indexValue) => runningTotal + indexValue, 0);

    return (total / DigitalSignalProcessor.BUFFER_SIZE);
  }

  public toString(): string {
    return this.getProcessedValue().toString();
  }
}
