import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

const animationDuration = 150;

/**
 * When drag handle is attached to the DOM, it slides from off screen to the right.
 * When it is detached, it slides back
 * @type {AnimationTriggerMetadata}
 */
export const transformHandle: AnimationTriggerMetadata = trigger('handleSlide', [
  state('in', style({ transform: 'translateX(0)' })),
  transition(
    'void => *',
    [style({ transform: 'translateX(-60px)' }), animate(animationDuration)]
  ),
  transition(
    'in => void',
    [animate(animationDuration, style({ transform: 'translateX(-30px)' }))]
  )
]);

/**
 * When drag mode is enabled, sidebar links shift to the right
 * to make space for drag handles.
 * When disabled, they slide back to the original place.
 *
 * Note that in both situations different lists are visible, that is why
 * both transitions are from void state.
 * @type {AnimationTriggerMetadata}
 */
export const transformLinks: AnimationTriggerMetadata = trigger('linkSlide', [
  state('out', style({ transform: 'translateX(60px)' })),
  transition(
    'void => in',
    [style({ transform: 'translateX(40px)' }), animate(animationDuration)]
  ),
  transition(
    'void => out',
    [style({ transform: 'translateX(25px)' }), animate(animationDuration)]
  )
]);
