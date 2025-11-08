"""
Web-compatible Flappy Bird - Simplified for Pygbag
Async-compatible version with touch controls
"""
import asyncio
import pygame
import random
import math

# Initialize
pygame.init()
SCREEN_WIDTH, SCREEN_HEIGHT = 1280, 720
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Modern Flappy Bird - Web")
clock = pygame.time.Clock()

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
PRIMARY = (88, 101, 242)
ACCENT = (235, 69, 158)
GOLD = (255, 215, 0)

# Game variables
bird_y = SCREEN_HEIGHT // 2
bird_velocity = 0
gravity = 0.5
jump_strength = -8
pipes = []
score = 0
game_over = False
game_started = False

def create_pipe():
    height = random.randint(100, SCREEN_HEIGHT - 300)
    return {'x': SCREEN_WIDTH, 'height': height, 'passed': False}

def draw_bird(x, y):
    pygame.draw.circle(screen, GOLD, (int(x), int(y)), 20)
    pygame.draw.circle(screen, WHITE, (int(x + 8), int(y - 5)), 6)
    pygame.draw.circle(screen, BLACK, (int(x + 10), int(y - 5)), 3)

def draw_pipe(pipe):
    pygame.draw.rect(screen, PRIMARY, (pipe['x'], 0, 70, pipe['height']))
    pygame.draw.rect(screen, PRIMARY, (pipe['x'], pipe['height'] + 200, 70, SCREEN_HEIGHT))

async def main():
    global bird_y, bird_velocity, pipes, score, game_over, game_started
    
    # Initial pipe
    pipes.append(create_pipe())
    
    font = pygame.font.Font(None, 48)
    small_font = pygame.font.Font(None, 32)
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return
            
            # Handle input - keyboard, mouse, and touch
            if event.type in (pygame.KEYDOWN, pygame.MOUSEBUTTONDOWN, pygame.FINGERDOWN):
                if not game_started:
                    game_started = True
                if not game_over:
                    bird_velocity = jump_strength
                else:
                    # Reset game
                    bird_y = SCREEN_HEIGHT // 2
                    bird_velocity = 0
                    pipes = [create_pipe()]
                    score = 0
                    game_over = False
                    game_started = True
        
        # Update game
        if game_started and not game_over:
            bird_velocity += gravity
            bird_y += bird_velocity
            
            # Move pipes
            for pipe in pipes:
                pipe['x'] -= 3
            
            # Remove off-screen pipes
            pipes = [p for p in pipes if p['x'] > -70]
            
            # Add new pipes
            if pipes and pipes[-1]['x'] < SCREEN_WIDTH - 300:
                pipes.append(create_pipe())
            
            # Check collisions
            bird_rect = pygame.Rect(80, bird_y - 20, 40, 40)
            for pipe in pipes:
                upper_rect = pygame.Rect(pipe['x'], 0, 70, pipe['height'])
                lower_rect = pygame.Rect(pipe['x'], pipe['height'] + 200, 70, SCREEN_HEIGHT)
                if bird_rect.colliderect(upper_rect) or bird_rect.colliderect(lower_rect):
                    game_over = True
                
                # Score
                if not pipe['passed'] and pipe['x'] < 80:
                    pipe['passed'] = True
                    score += 1
            
            # Check boundaries
            if bird_y < 0 or bird_y > SCREEN_HEIGHT:
                game_over = True
        
        # Draw
        screen.fill((135, 206, 235))  # Sky blue
        
        # Draw pipes
        for pipe in pipes:
            draw_pipe(pipe)
        
        # Draw bird
        if game_started:
            draw_bird(100, bird_y)
        
        # Draw score
        score_text = font.render(f'Score: {score}', True, WHITE)
        screen.blit(score_text, (SCREEN_WIDTH // 2 - 80, 20))
        
        # Draw instructions
        if not game_started:
            title = font.render('Modern Flappy Bird', True, WHITE)
            screen.blit(title, (SCREEN_WIDTH // 2 - 200, SCREEN_HEIGHT // 2 - 100))
            inst = small_font.render('Tap/Click/Space to Start', True, ACCENT)
            screen.blit(inst, (SCREEN_WIDTH // 2 - 160, SCREEN_HEIGHT // 2))
        
        # Game over
        if game_over:
            go_text = font.render('Game Over!', True, WHITE)
            screen.blit(go_text, (SCREEN_WIDTH // 2 - 100, SCREEN_HEIGHT // 2 - 50))
            restart = small_font.render('Tap/Click to Restart', True, ACCENT)
            screen.blit(restart, (SCREEN_WIDTH // 2 - 120, SCREEN_HEIGHT // 2 + 20))
        
        pygame.display.flip()
        clock.tick(60)
        
        # Yield to browser (required for Pygbag)
        await asyncio.sleep(0)

# Run
if __name__ == "__main__":
    asyncio.run(main())
