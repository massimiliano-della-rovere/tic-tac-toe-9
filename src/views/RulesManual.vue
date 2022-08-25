<template>
  <section id="rules">
    <details>
      <summary>Players</summary>
      <article>
        This is a 2-players game.<br/>
        One player is identified by the circle symbol {{ CIRCLE }}, the other one by the cross symbol {{ CROSS }} .<br/>
      </article>
    </details>
    <hr/>
    <details>
      <summary>Play area</summary>
      <article>
        <p>
          The game is played on 9 (a 3×3 matrix) boards.<br/>
          Each board is composed of 9 (a 3×3 matrix) cells.
        </p>
        <p>
          In these rules and their examples, the ID of each board and each cell corresponds to its position on the compass rose.<br/>
          A few examples:
        </p>
        <ul>
          <li>The ID of the board in the top right corner is ID "<dfn>ne</dfn>", </li>
          <li>The ID of the board in the bottom left corner has ID "<dfn>sw</dfn>".</li>
          <li>The ID of the board in middle is "<dfn>c</dfn>" (center), and so on.</li>
        </ul>
        <p>
          The naming of a cell's position inside a board follows exactly the very same logic used to calculate a board's ID.
        </p>
        <p>
          The ID of a cell is the composed of its board's ID, a dash ("-") and the cell position name.<br/>
          A few examples:
        </p>
        <ul>
          <li>The ID of the top right cell in the bottom left board is "<dfn>sw-ne</dfn>".</li>
          <li>The ID of the center cell in the center board is "<dfn>c-c</dfn>", and so on.</li>
        </ul>
      </article>
    </details>
    <hr/>
    <details>
      <summary>How to play the Game</summary>
      <article>
        <p>
          During her/his turn a player must mark an empty cell with her/his symbol ({{ CIRCLE }} or {{ CROSS }}) by selecting an empty cell and clicking on it.<br/>
          Players alternate taking their action until:
        </p>
        <ul>
          <li>either one of the wins the game (read next section) </li>
          <li>or all of the cells are marked with a {{ CIRCLE }} or a {{ CROSS }}, in the latter case the game ends with a tie.</li>
        </ul>
        <p>
          When the game begins, the first player may mark any 1 cell on any board (s)he prefers.<br/>
          The position of the most-recently marked cell determines the board(s) where the opponent must play her/his next action.<br/>
          Take note of the position of the cell and find the board whose ID corresponds to that position.<br/>
        </p>
        <ul>
          <li>if the board is still not seized by any player, the opponent must play her/his next action on that board,</li>
          <li>if the board is already seized by any player, the opponent must play her/his next action on any 1 non-seized board (s)he prefers.</li>
        </ul>
      </article>
    </details>
    <hr/>
    <details>
      <summary>How to win the Game</summary>
      <article>
        <p>
        To win the game a player must seize control of 3 boards aligned horizontally, vertically, or diagonally.<br/>
        A player seizes control of a board where there are 3 cells that at the same time:
        </p>
        <ul>
          <li>are all marked with her/his symbol and</li>
          <li>are aligned horizontally, vertically, or diagonally.</li>
        </ul>
      </article>
    </details>
  </section>
</template>



<script setup>
import { CIRCLE, CROSS } from "@/lib/constants/content.js"
</script>



<style scoped>
</style>