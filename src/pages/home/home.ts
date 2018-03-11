import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Gyroscope, GyroscopeOptions, GyroscopeOrientation} from "@ionic-native/gyroscope";
import {Platform} from 'ionic-angular';

import {DigitalSignalProcessor} from '../../models/dsp.class';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /**
   * @type {number}
   */
  protected alpha: DigitalSignalProcessor;

  /**
   * @type {number}
   */
  protected beta: DigitalSignalProcessor;

  /**
   * @type {number}
   */
  protected gamma: DigitalSignalProcessor;

  /**
   * @type {string}
   */
  protected gyrocolor: string = '#000000';

  /**
   * @type {GyroscopeOptions}
   */
  private gyroOptions: GyroscopeOptions = {
    frequency: 25
  };

  /**
   * @param {NavController} navCtrl
   * @param {Gyroscope} gyro
   * @param {Platform} platform
   */
  constructor(public navCtrl: NavController,
              public gyro: Gyroscope,
              public platform: Platform) {

    this.alpha = new DigitalSignalProcessor();
    this.beta  = new DigitalSignalProcessor();
    this.gamma = new DigitalSignalProcessor();

    if (platform.is('cordova')) {
      this.gyro.watch(this.gyroOptions)
        .subscribe((data: GyroscopeOrientation) => {
            this.alpha.push(data.x);
            this.beta.push(data.y);
            this.gamma.push(data.z);

            this.gyrocolor = this.convertToRGB(
              this.alpha.getProcessedValue(),
              this.beta.getProcessedValue(),
              this.gamma.getProcessedValue()
            );
          }
        );
    } else {
      setInterval(($scope) => {
        $scope.alpha.push(0);
        $scope.beta.push(0);
        $scope.gamma.push(0);

        $scope.gyrocolor = this.convertToRGB(
          $scope.alpha.getProcessedValue(),
          $scope.beta.getProcessedValue(),
          $scope.gamma.getProcessedValue()
        );
      }, this.gyroOptions.frequency, this);
    }
  }

  /**
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   * @returns {string}
   */
  private convertToRGB(alpha: number, beta: number, gamma: number): string {
    let transformation = (value) => {
      return Number(((Math.abs(value) * 20000) % 256).toFixed(0));
    };

    let red: number   = transformation(alpha);
    let green: number = transformation(beta);
    let blue: number  = transformation(gamma);

    let redHex: string   = red.toString(16);
    let greenHex: string = green.toString(16);
    let blueHex: string  = blue.toString(16);

    if (redHex.length < 2) {
      redHex = '0' + redHex;
    }
    if (greenHex.length < 2) {
      greenHex = '0' + greenHex;
    }
    if (blueHex.length < 2) {
      blueHex = '0' + blueHex;
    }

    return '#' + redHex + greenHex + blueHex;
  }
}
