class MicrophoneSettingService {
    async devices() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            throw(Error("UserMediaDetector getDevices failed: enumerateDevices is not supported"));
            }

        await navigator.mediaDevices.getUserMedia({  audio: true });
        
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            
        const microphones = mediaDevices.filter(device => device.kind === "audioinput");
        return microphones.map(d => {
            return d.label;
        });
    }

    async permitted(kind) {
        if (!kind || !Object.values(MicrophoneSettingService.Kinds).includes(kind)) {
          throw(Error(`UserMediaDetector permitted failed: kind ${kind} is not supported`));
        }
    
        const devices = await this.devices();
    
        // Note: The presence of a `label` on a device indicates that it
        //   the device is active or persistent permissions are granted.
        const permitted = !!devices.find(
          device => device.kind === kind && !!device.label
        );
    
        return permitted;
      }

      // Returns boolean value designating if all given media kinds are permitted.
    async permittedAll(kinds = Object.values(MicrophoneSettingService.Kinds)) {
        const kindsArray = Array.isArray(kinds) ? kinds : Array.of(kinds);
        const permissionStates = await Promise.all(kindsArray.map(kind => this.permitted(kind)));

        return permissionStates.every(isPermitted => isPermitted);
    }
        
    async setConnectedDevices(device) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const listMic = devices.filter(device => device.kind === "audioinput")
        let selectedDevice = listMic.find(d => d.label == device);
        console.log('selected: ', selectedDevice);
        const constraints = {
            audio: {
                deviceId: selectedDevice.deviceId
                ? {exact: selectedDevice.deviceId}
                : undefined,
                
            }
        };

        return await navigator.mediaDevices.getUserMedia(constraints);
      }
    
 
}

let microphoneSettingService = new MicrophoneSettingService();

export default microphoneSettingService;