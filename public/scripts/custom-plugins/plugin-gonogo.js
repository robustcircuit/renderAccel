var jsPsychGONOGO = (function (jspsych) {

  /// DEFINITIONS

  'use strict';
  const info = {
    name: "Gonogo",
    parameters: {
      update_progressbar: {
        default: false,
        type: jspsych.ParameterType.BOOL,
        array: false,
        pretty_name: "update-progress",
      },
      response_device: {
        type: jspsych.ParameterType.STRING,
        pretty_name: "response-device",
        array: false,
        default: 'keyboard',
      },
      key_choices: {
        type: jspsych.ParameterType.INT,
        pretty_name: "key-choices",
        array: false,
        default: "ALL_KEYS",
      }
    },
  };

  /**
   * **GoNogo plugin**
   * **romain.ligneul@gmail.com / 2023**
   * @author Romain Ligneul
   */


  class jsPsychGONOGOPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
      this.mouse_position = {
        x: 0,
        y: 0
      }
    };

    trial(display_element, trial) {

      console.log(trial.response_device)
      var trialdata = [];
      trialdata.tnum = tnum;
      trialdata.condition = condition[tnum];
      trialdata.rt = -1;
      trialdata.correct = -1;
      trialdata.respside = -1;
      trialdata.intertrial = jsPsych.randomization.randomInt(timing.intertrial[0], timing.intertrial[1])

      //
      var respinfo;
      var keyboardListener;

      // ITI
      trialdata.startTime = performance.now();

      // 
      function displayFixation() {
        d3.select(stimdef.idFixation).attr('opacity', '1')
        d3.select(stimdef.idMain).attr('opacity', '1')
        jsPsych.pluginAPI.setTimeout(function () {
          if (trial.response_device == 'keyboard') {
            keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
              callback_function: getResponse,
              valid_responses: trial.key_choices,
              rt_method: "performance",
              persist: false,
              allow_held_key: false,
            })
          } else if (trial.response_device == 'touch') {
            d3.select(stimdef.idTouchzone).on("touchstart", function (touchevent) {
              var touchinfo = [];
              touchinfo.key = 'touch';
              touchinfo.rt = performance.now() - trialdata.startTime;
              getResponse(touchinfo)
          })
          }
          displayCue();
        }, trialdata.intertrial)
      }

      function getResponse(respdata) {
        console.log(respdata.key)
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener)
        if (trialdata.condition == 0) {
          trialdata.correct = 0;
          trialdata.rt = respdata.rt;
        } else {
          trialdata.correct = 1;
          trialdata.rt = respdata.rt;
        }
      }

      function displayCue() {
        d3.select(stimdef.idTargets[condition[tnum]]).attr('opacity', '1')
        d3.select(stimdef.idFixation).attr('opacity', '0')
        jsPsych.pluginAPI.setTimeout(function () {
          if ((trialdata.condition == 0) && (trialdata.rt == -1)) {
            trialdata.correct = 1;
          };
          displayOutcome()
        }, timing.displayCue)
      }

      function displayOutcome() {
        d3.select(stimdef.idTargets[condition[tnum]]).attr('opacity', '0')
        if (trialdata.correct == 1) {
          d3.select(stimdef.feedbackMsg).text('Correct')
        } else {
          d3.select(stimdef.feedbackMsg).text('Incorrect')
        }
        d3.select(stimdef.feedbackMsg).attr('opacity', '1')
        d3.select(stimdef.idFixation).attr('opacity', '0')
        jsPsych.pluginAPI.setTimeout(function () {
          d3.select(stimdef.feedbackMsg).attr('opacity', '0')
          console.log('end trial: ' + tnum)
          jsPsych.finishTrial(trialdata)
        }, timing.displayOutcome)
      }

      displayFixation()

      /*
      function progressBarUpdate() {
        if (trial.update_progressbar) {
          var progressbar_fullLength = Number(d3.select("#progressframe").attr('width'))
          var progressbar_x = Number(d3.select(stimdef.idProgress).attr('x'))
          var current_x = Number(d3.select(stimdef.idProgress).attr('x'));
          var point2bar = 0.5 * progressbar_fullLength / maxReward;
          if (trialdata.feedback == 2) {
            var delta_x = point2bar;
          } else if (trialdata.feedback == 0) {
            var delta_x = -point2bar;
          } else {
            var delta_x = 0;
          }
          // increment
          var next_x = current_x + delta_x;
          d3.select(stimdef.idProgress)
            .transition().duration(100).attr('x', next_x.toString())
            .transition().duration(timing.feedback - 200).style('fill', stimdef.correct_feedbackColor[trialdata.feedback]).on("end", () => {
              d3.select(stimdef.idProgress).transition().duration(100).style('fill', "#ffffffff")
            })
    
          var current_width = Number(d3.select("#timebar").attr('width'));
          progressbar_fullLength = Number(d3.select("#timeframe").attr('width'))
          var point2bar = progressbar_fullLength / (4*expdef.trialsPercond);
    
          var next_width = current_width + point2bar;
          d3.select("#timebar")
          .transition().duration(100).attr('width', next_width.toString())
    
        }
      }
    
      */


    }

  }

  jsPsychGONOGOPlugin.info = info;

  return jsPsychGONOGOPlugin;

})(jsPsychModule);