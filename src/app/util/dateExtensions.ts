import './numberExtensions';

declare global {
    interface Date {
      toPreferredStringFormat(): string;
    }
  }
  
  
Date.prototype.toPreferredStringFormat = function() {
    return this.getFullYear() + "-" + (1 + this.getMonth()).PadWithZero() + "-" +this.getDate().PadWithZero() + " " + this.getHours().PadWithZero() + ":" + this.getMinutes().PadWithZero() + ":" + this.getSeconds().PadWithZero();
};

export { }
